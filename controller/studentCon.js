const mongoose=require("mongoose")
const jwt = require("jsonwebtoken")

const studentModel = require('../Models/studentMod');


let mobileRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/

let emailRegex = /^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/

let validatePassword = (password) => {
  var pass = /^(?=.*?[A-Za-z0-9#?!@$%^&*-]).{8,15}$/
  return pass.test(password)
}

const isValid = function (value) {
    if( typeof value == 'string' && value.trim().length == 0 ) {
      // console.log("2") 
        return false
    }
    if ( typeof value == 'number' ) {
      // console.log("5")
        return false
    }
    return true
  }
 
  const validBody = function (value) {

    if (typeof value === 'undefined' || value === null) {
        return false
    }
    if (typeof value === 'string' && value.trim().length == 0) {
        return false
    }
    return true

}

  const isvalid = function (value) {
    if( typeof value == 'string' && value.trim().length == 0 ) {
      // console.log("2") 
        return false
    }
    return true
  }

  const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
   }

    module.exports.createStudent= async function (req, res) {
        try { 
          let data = req.body 
         const { Name, Age, Mobile, Email, Password, isDeleted, } = data;
         
              if ( !isValid ( Name) ){return res.status(400).send({status:false, msg:"Enter valid Name."})} 
              if ( !isvalid ( Age ) ) {return res.status(400).send({status:false, msg:"Enter valid Age."})}
              if ( !isValid ( Mobile) ) {return res.status(400).send({status:false, msg:"Enter valid mobile number"})}
              if ( !isValid ( Email ) ) {res.status(400).send({status:false, msg:"Enter valid Email."})}
              if (!validBody(Password)) { return res.status(400).send({ status: false, message: "enter the password" }) }
              
              if (Object.keys(data).length == 0) {
                return res.status(400).send({ status: false, msg: "Body should not be Empty.. " })
            }
             
            if (!mobileRegex.test(Mobile)) {
                return res.status(400).send({ Status: false, message: "Please enter valid Indian mobile number ⚠️⚠️" })
            }
            if(Mobile){
                let checkmobile = await studentModel.findOne({ Mobile: Mobile })
    
                if (checkmobile) {
                    return res.status(400).send({ Status: false, message: "Please provide another number, this number has been used ⚠️⚠️" })
                }
            }
            if (!emailRegex.test(Email)) {
                return res.status(400).send({ Status: false, message: "Please enter valid email ⚠️⚠️" })
            }
    
            if (Email) {
                let checkemail = await studentModel.findOne({ Email: Email })
    
                if (checkemail) {
                    return res.status(400).send({ Status: false, message: "Please provide another email, this email has been used ⚠️⚠️" })
                }
            }
             
            if(Password){
              if (!validatePassword(Password)) { return res.status(400).send({ status: false, msg: "enter valid password" }) }
            }

            let Student= await studentModel.create(data)
            let savedData = await studentModel.findOne(Student).select({Password:0})
            let date=new Date
            res.status(200).send({ status: true, msg: "Student Added Successfully ✅✅" ,createdAt:date.toLocaleString() , data: savedData})
        }
        
        catch (error) {
            res.status(500).send({ status: false, error: error.message})
        }
    }

    module.exports.loginStudent = async function (req, res) {
      try {
        let data=req.body
      let{Name,Password}=data
    
      if(Object.keys(data).length<=1){ return res.status(400).send({ status: false, message: "required details (email and password) are missing" })}
        let student = await studentModel.findOne({Name:Name, Password:Password});
        if (!student)
          return res.status(400).send({
            status: false, msg: "username or password is not correct",
          });
     
        let token = jwt.sign(
          {
            studentId: student._id.toString(),
            organisation: "InfoDrive Solutions",
          },
          "AnjaliAyushAdityaAmit" 
        );
         res.setHeader("x-api-key", token);
         let date=new Date
        res.status(200).send({ status: true, msg:"login successfull", lastLogin : date.toLocaleString()});
    
      }
      catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
      }
    }


    module.exports.getStudents=async function(req,res){
      try {
        let q = req.query
        q.isDeleted=false

        const data = await studentModel.find(q).select({Password:0})
        // console.log(data)
        if (data.length == 0) return res.status(404).send({ status: false, msg: "No student record found" });
         
        let date=new Date
        res.status(200).send({ status: true, lastSeen: date.toLocaleString(), data: data })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
  }


module.exports.updateStudent=async function(req,res){
    try{
    let data=req.body
    let studentId=req.params.studentId    

    if (!isValidObjectId(studentId)) {
      return res.status(400).send({ status: false, message: "StudentId is in invalid format." })}
    
   
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "Body should not be Empty.. " })
    }
    if(data.Name){
    if ( !isValid ( data.Name) ){return res.status(400).send({status:false, msg:"Enter valid Name."})} }
    
    if(data.Age){
    if ( !isvalid ( data.Age ) ) {return res.status(400).send({status:false, msg:"Enter valid Age."})}}
      
    
    if(data.Mobile){
      if ( !isValid ( data.Mobile) ){return res.status(400).send({status:false, msg:"Enter valid mobile."})} 
    if (!mobileRegex.test(data.Mobile)) {
      return res.status(400).send({ Status: false, message: "Please enter valid Indian mobile number ⚠️⚠️" })
  }
  
      let checkmobile = await studentModel.findOne({ Mobile: data.Mobile })

      if (checkmobile) {
          return res.status(400).send({ Status: false, message: "Please provide another number, this number has been used ⚠️⚠️" })
      }
  }
if(data.Email){
  if ( !isValid ( data.Email ) ) {res.status(400).send({status:false, msg:"Enter valid Email."})}

  if (!emailRegex.test(Email)) {
      return res.status(400).send({ Status: false, message: "Please enter valid email ⚠️⚠️" })
  }

      let checkemail = await studentModel.findOne({ Email: data.Email })

      if (checkemail) {
          return res.status(400).send({ Status: false, message: "Please provide another email, this email has been used ⚠️⚠️" })
      }
  }

  let student = await studentModel.findOneAndUpdate({_id:studentId,isDeleted:false},
    {
      $set: { Name:data.Name, Age:data.Age, Mobile: data.Mobile, Email:data.Email}
 },
 {new : true}).select({Password:0});

 if (!student) {
  return res.status(404).send({ status: false, msg: "No such student exists" })};   

  let date=new Date

res.status(200).send({ status: true, msg:"Student details updated successfully", updatedAt: date.toLocaleString(), data: student});
}
catch (err) {
res.status(500).send({ status: false, msg: "Error", error: err.message })
}
}


module.exports.deleteStudent=async function(req,res){
  try{
  let delQueryData = req.query;
      
  const {Mobile} = delQueryData;

  if(Object.keys(delQueryData)==0){
    return res.status(400).send({status:false, message: "please provide the mobile number of the student which you want to delete"})
  }
 const findStudent = await studentModel.find({delQueryData})
  

if (findStudent.length==0 || {isDeleted:true}) return res.status(404).send({ status: false, message: "No Student found" });

  await studentModel.findOneAndUpdate({delQueryData},{$set:{isDeleted:true}},{new:true})

  let date= new Date
return res.status(200).send({ status: true, DeletedAt: date.toLocaleString(), message: "student successfully deleted"});
}
  catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
}

