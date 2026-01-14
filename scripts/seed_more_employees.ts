
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dnmtpwbfnptybciyqlcp.supabase.co";
const supabaseKey = "sb_publishable_YdoBJ9r2kBi6kEgVF3LNtg_a39wBdvl";

const supabase = createClient(supabaseUrl, supabaseKey);

const departments = ["Engineering", "Marketing", "HR", "Sales", "Finance", "Design"];
const positions = {
    "Engineering": ["Senior Developer", "Junior Developer", "DevOps Engineer", "QA Engineer"],
    "Marketing": ["Marketing Manager", "Content Writer", "SEO Specialist"],
    "HR": ["HR Manager", "Recruiter"],
    "Sales": ["Sales Representative", "Account Manager"],
    "Finance": ["Accountant", "Financial Analyst"],
    "Design": ["UI/UX Designer", "Graphic Designer"]
};

const firstNames = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];

function getRandomElement(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function seedEmployees() {
    console.log("Generating 20 employees...");
    const employees = [];

    for (let i = 0; i < 20; i++) {
        const firstName = getRandomElement(firstNames);
        const lastName = getRandomElement(lastNames);
        const name = `${firstName} ${lastName}`;
        const dept = getRandomElement(departments);
        // @ts-ignore
        const pos = getRandomElement(positions[dept]);
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@humana.com`;
        const id = `${dept.substring(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`; // e.g., ENG123

        employees.push({
            id: id, // Assuming manual ID for now based on previous pattern
            name: name,
            email: email,
            department: dept,
            position: pos,
            join_date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
            phone: `+62 81${Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 10000)}`,
            status: "Active",
            avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
        });
    }

    const { data, error } = await supabase.from('employees').upsert(employees, { onConflict: 'id' }).select();

    if (error) {
        console.error("Error seeding employees:", error);
    } else {
        console.log(`Successfully inserted ${data.length} employees.`);
    }
}

seedEmployees();
