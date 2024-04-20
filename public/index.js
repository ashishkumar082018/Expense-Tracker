const form = document.querySelector("form");
const ul = document.querySelector("ul");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = e.target.amount.value;
    const description = e.target.description.value;
    const category = e.target.category.value;

    const expenseDetails = {
        amount: amount,
        description: description,
        category: category,
        userId: 1
    };

    try {
        const token = localStorage.getItem('token');
        const res = await axios.post("http://localhost:3000/expense/add-expense", expenseDetails, {
            headers: {
                "Authorization": token
            }
        });
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

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem('token');
        const result = await axios.get("http://localhost:3000/expense/get-expense", {
            headers: {
                "Authorization": token
            }
        });
        result.data.forEach((expense) => {
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
            ul.appendChild(li);

            const editBtn = li.querySelector(".edit-btn");
            const deleteBtn = li.querySelector(".delete-btn");

            editBtn.addEventListener("click", async () => {
                try {
                    const res = await axios.delete(`http://localhost:3000/expense/delete-expense/${editBtn.parentElement.id}`, {
                        headers: {
                            "Authorization": token
                        }
                    });
                    document.getElementById("amount").value = amount;
                    document.getElementById("description").value = description;
                    document.getElementById("category").value = category;
                    editBtn.parentElement.remove();
                } catch (err) {
                    console.log(err);
                }
            });

            deleteBtn.addEventListener("click", async () => {
                try {
                    const res = await axios.delete(`http://localhost:3000/expense/delete-expense/${deleteBtn.parentElement.id}`, {
                        headers: {
                            "Authorization": token
                        }
                    });
                    deleteBtn.parentElement.remove();
                } catch (err) {
                    console.log(err);
                }
            });
        });
    } catch (err) {
        console.log(err);
    }
});
