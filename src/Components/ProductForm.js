import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { instance } from "./LInk";

function ProductForm({ fetchProducts }) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [category, setCategory] = useState(""); // UUID formatida saqlanadi
  const [image, setImage] = useState("");
  const [minAmount, setMinAmount] = useState(1);
  const [color, setColor] = useState(""); // Rang tanlagich uchun
  const [bonus, setBonus] = useState("");
  const [categories, setCategories] = useState([]);
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false); // Rang tanlagichni ko'rsatish holati

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
      fetchProducts();
      setName("");
      setCost("");
      setCategory("");
      setImage("");
      setMinAmount(1);
      setColor("");
      setBonus("");
      setValidated(false);
    } catch (error) {
      console.error("Failed to add product:", error);
      setError("Failed to add product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleColorClick = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleColorChange = (color) => {
    setColor(color.hex);
    setShowColorPicker(false); // Rang tanlagichni yopish
  };

  // Ranglar ro'yxati
  const colorOptions = [
    { value: "Oq", label: "Oq" },
    { value: "Qora", label: "Qora" },
    { value: "Sariq", label: "Sariq" },
    { value: "Qizil", label: "Qizil" },
    { value: "Yashil", label: "Yashil" },
    { value: "Ko'k", label: "Ko'k" },
  ];

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
            Mahsulot nomi kiriting.
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
            Mahsulot narxi kiriting.
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
            Kategoriya tanlang.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formProductMinAmount">
          <Form.Label>Miqdor</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Miqdor kiriting.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formProductColor">
          <Form.Label>Rang</Form.Label>
          <Form.Control
            as="select"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            <option value="">Rang tanlang</option>
            {colorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formProductBonus">
          <Form.Label>Izoh</Form.Label>
          <Form.Control
            type="text"
            placeholder="Mahsulot izohini kiriting"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formProductPhoto">
          <Form.Label>Mahsulot rasm</Form.Label>
          <Form.Control type="file" onChange={handlePhotoChange} />
        </Form.Group>
        {error && <div className="error-message">{error}</div>}
        <Button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? "Yuborilmoqda..." : "Qo'shish"}
        </Button>
      </Form>
    </div>
  );
}

export default ProductForm;
