var express = require('express');
const { teachers } = require('./modules/dbcontroller');
const { students } = require('./modules/dbcontroller2');
var router = express.Router();



const options = { year: 'numeric', month: '2-digit', day: '2-digit' };

router.post('/tlogin',async (req, res) => {
    const { email, password } = req.body;
   // console.log(req.body);
    try {
        
      // Query the database to find a user with the provided email
      const user = await  teachers.findOne({
        
        where: { email:email },
      });
  
      if (user) {
        // If a user with the provided email is found, compare passwords
        if (user.password === password) {
          // Passwords match, create a session for the user
          req.session.user = email;
          res.redirect('/route/tpage');
        } else {
          // Passwords do not match
          res.end("Invalid credentials");
        }
      } else {
        // User with the provided email not found in the database
        res.end("User not found");
      }
    } catch (error) {
      // Handle database query errors
      console.error("Error querying database:", error);
      res.status(500).end("Internal server error");
    }
  });
  

router.get('/logout', (req ,res)=>{
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("Error");
        }else{
            res.render('home');
        }
    })
})


router.get('/tpage', async (req, res) => {
  if (req.session.user) {
    try {
     
      const count = await students.count();
      // Query the database to retrieve student records from the 'students' table
      const st = await students.findAll(
        
      );
    
        const updatedData = st.map((student) => {
          // console.log(student);
          return { name: student.name, rno: student.rno, score:student.score, dob: new Date(student.dob).toLocaleDateString('en-IN', options) };
        });
     
      console.log(updatedData,count,req.session.user);
      // Render the 'tpage' template with the student records
      res.render('tpage', { user: req.session.user, st:updatedData, count:count });
    } catch (error) {
      console.error('Error querying students:', error);
      res.status(500).send('Internal server error');
    }
  } else {
    res.send('Unauthorized User');
  }
});

router.get('/addrecord', (req, res) => {
    if(req.session.user){
        res.render('addrecord', {user : req.session.user})
    }else{
        res.send("Unauthorize User")
    }
});

router.post('/add-student', async (req, res) => {
  try {
    const {  name, rno,dob, score } = req.body;

    // Create a new student record in the database
    const newStudent = await students.create({
      name: name,
      rno: rno,
      dob: dob,
      score: score,
    });

    res.render('addrecord', {user : req.session.user})
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

router.get('/edit/:roll', async(req,res)=>{
  res.render('edit',{rno:req.params.roll});
})

router.post('/edit-student/:roll', async(req,res)=>{
  try {
  
    
    // Define the updated data
    const updatedData = {
     rno: req.body.rno,
    name: req.body.name,
    dob: req.body.dob,
    score: req.body.score,      // Add other fields you want to update here
    };

    // Perform the update
    const [updatedRowCount] = await students.update(updatedData, {
      where: { rno : req.body.rno },
    });
    res.redirect("/route/tpage");
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/delete/:rno', async (req, res) => {
  try {
    const studentId = req.params.rno;

    // Use the `destroy` method to delete the student
    const deletedRowCount = await students.destroy({
      where: { rno: studentId },
    });

    res.redirect('/route/tpage');

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/slogin',async (req, res) => {
  const { rno, name } = req.body;
 // console.log(req.body);
  try {
      
    // Query the database to find a user with the provided email
    const user = await  students.findOne({
      
      where: { rno:rno },
    });

    if (user) {
      // If a user with the provided email is found, compare passwords
      if (user.name === name) {
        // Passwords match, create a session for the user
        req.session.user = rno;
        res.redirect('/route/result');
      } else {
        // Passwords do not match
        res.end("Invalid credentials");
      }
    } else {
      // User with the provided email not found in the database
      res.end("Student not found");
    }
  } catch (error) {
    // Handle database query errors
    console.error("Error querying database:", error);
    res.status(500).end("Internal server error");
  }
});


router.get('/result',async (req, res) => {
    if(req.session.user){
        const st = await students.findOne({
          where: {rno : req.session.user},
        });
        


        //st.dob = new Date(st.dob).toLocaleDateString('en-IN', options);
        
        res.render('result',{stud:{
          name:st.name,
          rno: st.rno,
          score: st.score,
          dob: new Date(st.dob).toLocaleDateString('en-IN', options),
        }});
    }
    else{
        res.send("Unauthorize User")
    }
});

module.exports = router;