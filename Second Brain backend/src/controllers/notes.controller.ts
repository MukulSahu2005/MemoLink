import { type Request,type Response } from 'express';
import { noteModel, type NoteType } from '../models/notes.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';
import crypto from 'crypto';

interface AuthenticatedRequest extends Request {
  user?: {
    username:string;
    id?: string;
    email: string;
  };
}

/**
 * @desc    Create a structured note or resource link
 * @route   POST /api/v1/notes
 */
export const createNote= asyncHandler(async(req:AuthenticatedRequest,res: Response):Promise<void>=>{
  const { title, content, type, link, tags } = req.body;
  const username=req.user?.username;

  if(!username){
    throw new ApiError(401,'Unauthorized access. Missing session username.');
  }

  if (!title || !content || !type) {
    throw new ApiError(400, 'Title, content, and type are mandatory fields.');
  }

  const allowedTypes: NoteType[] = ['document', 'tweet', 'youtube', 'link'];
  if (!allowedTypes.includes(type)) {
    throw new ApiError(400, `Invalid type. Allowed types: ${allowedTypes.join(', ')}`);
  }

  const newNote = await noteModel.create({
      title,
      content,
      type,
      link: link || '',
      tags: tags || [],
      username,
  });
  
  res.status(201).json(
      new ApiResponse(201, newNote, 'Resource captured successfully')
    );
})


/**
 * @desc    Get all notes for the logged-in username
 * @route   GET /api//v1/notes
 */
export const getNotes = asyncHandler(async(req:AuthenticatedRequest, res:Response):Promise<void> =>{
  const username=req.user?.username;

  if (!username) {
    throw new ApiError(401, 'Unauthorized access. Missing session username.')  
  }

  // Query DB using username string
  const notes =await noteModel.find({username}).sort({createdAt:-1});  

  res.status(200).json(
    new ApiResponse(200,notes,"fetched all notes completely")
  )
})

/**
 * @desc    Update an existing note
 * @route   PUT /api/v1/notes/:id
 */
export const updateNote=asyncHandler(async(req:AuthenticatedRequest, res:Response)=>{
  const{id} =req.params ;
  const {title , content , type, link, tags}=req.body;
  const username=req.user?.username     //auth se joh aaya

  if (!username) {
    throw new ApiError(401, 'Unauthorized access. Missing session username.');
  }
  // Find the note first to check ownership
  const note = await noteModel.findById(id);

  if (!note) {
    throw new ApiError(404, 'Note not found.');
  }
  
  if (note.username !== username) {
    throw new ApiError(403, 'Forbidden. You do not own this note.');
  }

  if (title) note.title = title;
  if (content) note.content = content;
  if (type) note.type = type;
  if (link !== undefined) note.link = link;
  if (tags) note.tags = tags;

  const updatedNote = await note.save();

  res.status(200).json(
    new ApiResponse(200,updatedNote, "Note updated successfully .")
  )

})

/**
 * @desc    Delete a note
 * @route   DELETE /api/v1/notes/:id
 */
export const deleteNote = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const username = req.user?.username;

  if (!username) {
    throw new ApiError(401, 'Unauthorized access. Missing session username.');
  }

  const note = await noteModel.findById(id);

  if (!note) {
    throw new ApiError(404, 'Note not found.');
  }

  // Security Lock: Prevent users from deleting other people's notes
  if (note.username !== username) {
    throw new ApiError(403, 'Forbidden. You do not have permission to delete this note.');
  }

  //remove undefined and the array from object id types
  if (!id || Array.isArray(id)) {
      res.status(400).json({
        message: "Invalid note id",
      });
      return;
  }
  
  // Delete the document from MongoDB
  await noteModel.findOneAndDelete({ _id:new mongoose.Types.ObjectId(id), });

  res.status(200).json(
    new ApiResponse(200, null, 'Note deleted successfully')
  );
});




/**
 * @desc    get a note by  id
 * @route   GET /api/v1/notes/:id
 */
export const getNoteById = asyncHandler(async (req: AuthenticatedRequest,
    res: Response): Promise<void> => {
    const { id } = req.params;
    const username = req.user?.username;

    // auth check
    if (!username) {
      throw new ApiError(
        401,
        "Unauthorized access. Missing session username."
      );
    }
    
    //remove undefined and the array from object id types
  if (!id || Array.isArray(id)) {
      res.status(400).json({
        message: "Invalid note id",
      });
      return;
  }

    // validate mongodb id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400,"Invalid note id.");
    }

    // find note
    // const note = await noteModel.findById(id);
    const note = await noteModel.findOne({
      _id: id,
      username,
    });

    if (!note) {
      throw new ApiError(
        404,
        "Note not found."
      );
    }

    // ownership check
    // if (note.username !== username) {
    //   throw new ApiError(
    //     403,
    //     "Forbidden. You do not have permission to access this note."
    //   );
    // }

    // success
    res.status(200).json(
      new ApiResponse(
        200,
        note,
        "Note fetched successfully"
      )
    );
  }
);

/**
 * @desc    Toggle note visibility to public and generate unique secure hash token
 * @route   PATCH /api/v1/notes/:id/share
 */
export const enableSharing = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const username = req.user?.username;

  if (!username) {
    throw new ApiError(401, 'Unauthorized access. Session context missing.');
  }

  const note = await noteModel.findById(id);

  if (!note) {
    throw new ApiError(404, 'The targeted note does not exist.');
  }

  // Access Control: Validate that the client requesting the share toggle actually owns it
  if (note.username !== username) {
    throw new ApiError(403, 'Access denied. You do not own this note.');
  }

  // Toggle sharing state
  if (note.isShared) {
    note.isShared = false;
    note.shareableId = undefined;
    await note.save();
    
    res.status(200).json(
      new ApiResponse(200, { shareableId: null }, 'Public access revoked successfully.')
    );
  } 
  else {
    note.isShared = true;
    note.shareableId = crypto.randomBytes(12).toString('hex'); // Generates an unguessable 24-char hash string
    await note.save();

    res.status(200).json(
      new ApiResponse(200, { shareableId: note.shareableId }, 'Public link generated successfully.')
    );
  }
});

/**
 * @desc    Fetch a single note publicly via its unique share token
 * @route   GET /api/v1/notes/public/share/:shareableId
 * @access  Public (No JWT Middleware)
 */
export const getSharedNotePublicly = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { shareableId } = req.params;

  if (!shareableId) {
    throw new ApiError(400, 'Invalid routing token state.');
  }

  // Optimized pipeline query scanning only for active shared resource entries
  const note = await noteModel.findOne({ shareableId, isShared: true });

  if (!note) {
    throw new ApiError(404, 'This shared link is invalid or has been deactivated by the author.');
  }

  res.status(200).json(
    new ApiResponse(200, note, 'Shared resource fetched successfully.')
  );
});