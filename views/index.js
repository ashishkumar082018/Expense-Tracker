const form = document.querySelector("form");
const ul = document.querySelector("ul");
const token = localStorage.getItem("token");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = e.target.amount.value;
    const description = e.target.description.value;
    const category = e.target.category.value;
    const expenseDetails = {
        amount: amount,
        description: description,
        category: category
    };
    try {
        const res = await axios.post("http://localhost:3000/expense/add-expense", expenseDetails, { headers: { "Authorization": token } });
        const id = res.data.id;
        const li = document.createElement("li");
        li.id = id;
        const buttonHTML = `
            <button type="button" class="btn btn-success edit-btn" style="margin-left:auto; margin-right:5px;">Edit</button>
            <button type="button" class="btn btn-danger delete-btn">Delete</button>
            `;
        li.innerHTML = `${amount}-${description}-${category} ${buttonHTML}`;
        li.classList.add("list-group-item");
        li.classList.add("d-flex");
        li.classList.add("justify-content-between");
        li.classList.add("align-items-center");
        ul.appendChild(li);
    } catch (err) {
        console.log(err);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const result = await axios.get("http://localhost:3000/expense/get-expense", { headers: { "Authorization": token } });
        const fragment = document.createDocumentFragment();
        result.data.forEach(expense => {
            const amount = expense.amount;
            const description = expense.description;
            const category = expense.category;
            const li = document.createElement("li");
            li.id = expense.id;
            const buttonHTML = `
                <button type="button" class="btn btn-success edit-btn" style="margin-left:auto; margin-right:5px;">Edit</button>
                <button type="button" class="btn btn-danger delete-btn">Delete</button>
                `;
            li.innerHTML = `${amount} - ${description} - ${category} ${buttonHTML}`;
            li.classList.add("list-group-item");
            li.classList.add("d-flex");
            li.classList.add("justify-content-between");
            li.classList.add("align-items-center");
            fragment.appendChild(li);
        });
        ul.appendChild(fragment);
    } catch (err) {
        console.log(err);
    }
});

// Event delegation for edit and delete buttons
ul.addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("edit-btn")) {
        const id = target.parentElement.id;
        // Add your edit logic here
    } else if (target.classList.contains("delete-btn")) {
        const id = target.parentElement.id;
        try {
            await axios.delete(`http://localhost:3000/expense/delete-expense/${id}`, { headers: { "Authorization": token } });
            target.parentElement.remove();
        } catch (err) {
            console.log(err);
        }
    }
});
