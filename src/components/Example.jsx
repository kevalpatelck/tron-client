import { useState } from "react";
import axios from "axios";

const MyForm = () => {
    const [formData, setFormData] = useState({
        UID: "",
        userName: ""
    });

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents page reload

        try {
            const response = await axios.post("YOUR_API_URL", formData);
            console.log("Response:", response.data);
            alert("Data submitted successfully!");
        } catch (error) {
            console.error("Error posting data:", error);
            alert("Failed to submit data.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>UID:</label>
                <input
                    type="text"
                    name="UID"
                    value={formData.UID}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>User Name:</label>
                <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default MyForm;
