import express from "express";
import bodyParser from "body-parser";
import fs from 'fs'
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
let user = '';
let password = '';
let subject = '';
let contents = '';
let number = '';
var dic = [];
let list = '';
let indexnumber  = -1;
let deleteValue;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("./index.ejs")
  });

app.get("/test/:id", (req, res) => {

    const index = parseInt(req.params.id);
    const subejctItem = dic.find(item=>item.indexnumber === index);
    const filePath = path.join(__dirname, dic[index].subject + ".txt");
    
    console.log(subejctItem);
    if(subejctItem){

        res.sendFile(filePath,(err)=>{
            if(err){
                console.log(err);
                res.status(404).send('File not found!');
            }
        });
    }
    else{
        res.status(404).send('Subject not found!');
    }    
});


app.post("/delete", (req, res,next) => {
    deleteValue = req.body.id;
    console.log(deleteValue);
    const index = dic.findIndex(item => item.subject === deleteValue);
    if (index !== -1) {
        dic.splice(index, 1); // 해당 인덱스의 요소를 배열에서 제거
    }

    //dic 에서 제거. ?? 다른 방법이 있나 ?
    dic = dic.filter(item => item.subject !== undefined);
    
    res.render("./index.ejs",{
        boardlist : dic
    })

    fs.unlink(__dirname + "/"+subject+".txt", (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('File is deleted.');
        }
      });


    next();
    console.log(dic);
});


app.post("/submit", (req, res) => {

    indexnumber = indexnumber + 1;
    subject = req.body["fsubject"];    
    if(subject.length >0){
    dic.push(
        {
            subject : subject,
            indexnumber : indexnumber
        }
    )};

    const filePath = path.join(__dirname, subject + ".txt");

    console.log(filePath);
    var writeStream = fs.createWriteStream(filePath);
    // var writeStream = fs.createWriteStream(subject+".txt");
    
    // req.body["fcontets"] 에서 contents 
    writeStream.write("Hi, JournalDEV Users. ");
    writeStream.write("Thank You.");
    writeStream.end();

    res.render("./index.ejs",{
        boardlist : dic
    })
    console.log(dic)
});

// app.use(listAdd);

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

