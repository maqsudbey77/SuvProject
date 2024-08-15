import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { instance } from "./LInk";

function ProductForm({ fetchProducts }) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [category, setCategory] = useState(""); // UUID formatida saqlanadi
  const [image, setImage] = useState("");
  const [minAmount, setMinAmount] = useState(1);
  const [color, setColor] = useState("#ffffff"); // Default color
  const [bonus, setBonus] = useState("");
  const [categories, setCategories] = useState([]);
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await instance.get("/get_all_categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setError("Failed to fetch categories.");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setImage(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setImage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setIsSubmitting(true);
    setError(""); // Reset error message

    try {
      const newProduct = {
        name,
        price: cost,
        category: category,
        photo: image,
        min_amount: minAmount,
        color,
        bonus,
      };

      await instance.post("/create_product", newProduct);
      fetchProducts(); // Refresh product list
      setName("");
      setCost("");
      setCategory("");
      setImage("");
      setMinAmount(1);
      setColor("#ffffff");
      setBonus("");
      setValidated(false);
    } catch (error) {
      console.error("Failed to add product:", error);
      setError("Failed to add product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="productForm">
      <h2>Mahsulot qo'shish</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="formProductName">
          <Form.Label>Mahsulot nomi</Form.Label>
          <Form.Control
            type="text"
            placeholder="Mahsulot nomini kiriting"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Mahsulot nomi kerak.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formProductPrice">
          <Form.Label>Mahsulot narxi</Form.Label>
          <Form.Control
            type="number"
            placeholder="Mahsulot narxini kiriting"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Mahsulot narxi kerak.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formProductCategory">
          <Form.Label>Kategoriya</Form.Label>
          <Form.Control
            as="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Kategoriya tanlang</option>
            {categories.map((cat) => (
              <option key={cat.uuid} value={cat.uuid}>
                {cat.name}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            Kategoriya tanlanishi kerak.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formProductMinAmount">
          <Form.Label>Eng Kam Miqdor</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Eng kam miqdor kerak.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formProductColor">
          <Form.Label>Rang</Form.Label>
          <Form.Control
            type="text"
            placeholder="Rangni kiriting (hex format)"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Rang kerak.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formProductBonus">
          <Form.Label>Bonus</Form.Label>
          <Form.Control
            type="text"
            placeholder="Mahsulot bonusini kiriting"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formProductPhoto">
          <Form.Label>Mahsulot rasm</Form.Label>
          <Form.Control type="file" onChange={handlePhotoChange} />
        </Form.Group>
        {error && <div className="error-message">{error}</div>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Yuborilmoqda..." : "Qo'shish"}
        </Button>
      </Form>
    </div>
  );
}

export default ProductForm;
