class ApiResponse{
  statusCode:number;
  data:any;
  message:string;
  
  constructor(
    statusCode:number,
    data:any,
    message:string="success"
  ){
    this.statusCode=statusCode;
    this.data=data;
    this.message=message;
  }
}
export {ApiResponse}