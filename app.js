require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const employeeSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    salary: { type: Number, required: true },
    experience: { type: Number, required: true },
    skills: [String],
    status: { type: String, required: true }
});

const Employee = mongoose.model("Employee", employeeSchema);

app.get("/", (req, res) => {
    res.send("Employee Management System is Running");
});

async function main() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        await Employee.deleteMany({});

        await Employee.insertMany([
            {
                employeeId: "E101",
                name: "Athi",
                department: "IT",
                designation: "Developer",
                salary: 50000,
                experience: 2,
                skills: ["JavaScript", "Node.js"],
                status: "Active"
            },
            {
                employeeId: "E102",
                name: "Arun",
                department: "IT",
                designation: "Tester",
                salary: 45000,
                experience: 3,
                skills: ["Java", "Selenium"],
                status: "Active"
            },
            {
                employeeId: "E103",
                name: "Rahul",
                department: "HR",
                designation: "HR Manager",
                salary: 60000,
                experience: 5,
                skills: ["Recruitment", "Management"],
                status: "Active"
            },
            {
                employeeId: "E104",
                name: "Kiran",
                department: "Finance",
                designation: "Accountant",
                salary: 40000,
                experience: 4,
                skills: ["Excel", "Accounting"],
                status: "Active"
            }
        ]);

        console.log("\n4 Employees Inserted");

        const result1 = await Employee.find({
            department: "IT",
            experience: { $gt: 2 }
        });

        console.log("\nIT Employees with Experience > 2:");
        console.log(result1);

        const result2 = await Employee.findOne({
            employeeId: "E101"
        });

        console.log("\nEmployee E101:");
        console.log(result2);

        const result3 = await Employee.find(
            {},
            {
                _id: 0,
                name: 1,
                designation: 1,
                salary: 1,
                department: 1
            }
        );

        console.log("\nSelected Fields:");
        console.log(result3);

        const result4 = await Employee.findOneAndUpdate(
            { employeeId: "E101" },
            {
                designation: "Senior Developer",
                salary: 65000
            },
            { new: true }
        );

        console.log("\nUpdated Employee:");
        console.log(result4);

        await Employee.updateMany(
            { department: "IT" },
            { $mul: { salary: 1.10 } }
        );

        console.log("\nIT salaries increased by 10%");

        const result5 = await Employee.find({
            salary: {
                $gte: 40000,
                $lte: 60000
            }
        });

        console.log("\nSalary between 40000 and 60000:");
        console.log(result5);

        const result6 = await Employee.findOneAndDelete({
            employeeId: "E104"
        });

        console.log("\nDeleted Employee:");
        console.log(result6);

        const result7 = await Employee.find()
            .sort({ salary: -1 });

        console.log("\nRemaining Employees:");
        console.log(result7);

    } catch (error) {

        console.log("Error:");
        console.log(error);

    }

}

main();

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
