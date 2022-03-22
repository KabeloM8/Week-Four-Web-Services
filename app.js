const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const students = [
    { id: 1, name: 'Jane', surname: 'Doe', dateOfBirth:'DoB1', gender:'female' },
    { id: 2, name: 'John', surname: 'Smith', dateOfBirth:'DoB2', gender:'male' },
    { id: 3, name: 'Tom', surname: 'Cruz', dateOfBirth:'DoB3', gender:'male' },
]

app.get('/api/students', (req, res) => {
    res.send(students);
});

app.post('/api/students', (req, res) => {
    console.log(req.body);
    const { error } = validatestudent(req.body);
    if (error) {
        // 400 Bad Request
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const student = {
        id: students.length + 1,
        name: req.body.name,
        surname: req.body.surname,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
    };

    students.push(student);
    res.send(student);
});

app.put('/api/students/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) {
        res.status(404).send('The student was not found');
        return;
    }

    // const result = validatestudent(req.body);
    const { error } = validatestudent(req.body);
    if (error) {
        // 400 Bad Request
        res.status(400).send(error.details[0].message);
        return;
    }

    student.name = req.body.name;
    student.surname = req.body.surname;
    student.dateOfBirth = req.body.dateOfBirth;
    student.gender = req.body.gender;
    res.send(student);
})

app.get('/api/students/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) {
        res.status(404).send('The student was not found');
        return;
    }
    else { res.send(student) }
});

app.delete('/api/students/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) {
        res.status(404).send('The student was not found');
        return;
    }
    
    const index = students.indexOf(student);
    students.splice(index, 1);

    res.send(student);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
// app.listen(3000, () => console.log('Listening on port 3000...'));

function validatestudent(student) {
    const schema = {
        name: Joi.string().min(3).required(),
        surname: Joi.string().min(3).required(),
        dateOfBirth: Joi.string().min(3).required(),
        gender: Joi.string().min(3).required(),
    };
    return Joi.validate(student, schema);
}