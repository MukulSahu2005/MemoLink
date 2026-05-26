import { Router } from "express";
import{verifyJWT} from "../middlewares/auth.middleware.js"
import {createNote, deleteNote, getNotes, updateNote,getNoteById, getSharedNotePublicly, enableSharing} from "../controllers/notes.controller.js"
import { verify } from "jsonwebtoken";

const router=Router();

// // BASE PATH: "/api/v1/notes"
// router.route("/").post(verifyJWT,createNote);          // create
// router.route("/").get(verifyJWT,getNotes)             // get all notes 
// router.get("/:id", getNoteById);                      //get singlenote by id 
// router.route("/:id").patch(verifyJWT,updateNote)     // update a note
// router.route("/:id").delete(verifyJWT,deleteNote)     // delete a note


// BASE PATH: "/api/v1/notes"

router.route("/")
  .post(verifyJWT, createNote)
  .get(verifyJWT, getNotes)


// router.get("/:id", getNoteById); //get singlenote by id 


router.route("/:id")
  .get(verifyJWT,getNoteById)
  .patch(verifyJWT, updateNote)
  .delete(verifyJWT, deleteNote); 

// public route - no auth
router.route('/public/share/:shareableId')
  .get(getSharedNotePublicly);

router.route("/:id/share")
  .patch(verifyJWT,enableSharing)


export default router ;