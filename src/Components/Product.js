import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { MdDelete, MdEdit } from "react-icons/md";
import ProductForm from "./ProductForm";
import { instance } from "./LInk";

function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await instance.get("/get_all_products");
      setProducts(response.data);
    } catch (error) {
      console.error("Mahsulotlarni olishda xatolik: ", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await instance.get("/get_all_categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Kategoriyalarni olishda xatolik: ", error);
    }
  };

  const deleteProduct = async (uuid) => {
    try {
      await instance.delete(`/delete_product/${uuid}`);
      fetchProducts();
    } catch (error) {
      console.error("Mahsulotni o'chirishda xatolik: ", error);
    }
  };

  const handleShow = (product) => {
    setSelectedProduct({
      ...product,
      category_id: product.category.uuid,
    });
    setPhoto(product.photo || "");
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setPhoto(null);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setPhoto(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setPhoto("");
    }
  };

  const handleColorChange = (e) => {
    setSelectedProduct({
      ...selectedProduct,
      color: e.target.value,
    });
  };

  const handleSaveChanges = async () => {
    if (selectedProduct) {
      try {
        const updatedProduct = {
          name: selectedProduct.name,
          price: selectedProduct.price,
          category: selectedProduct.category.uuid,
          min_amount: selectedProduct.min_amount,
          color: selectedProduct.color,
          bonus: selectedProduct.bonus === "" ? null : selectedProduct.bonus,
          photo: photo ? `${photo}` : selectedProduct.photo,
        };

        await instance.patch(`/update_product/${selectedProduct.uuid}/`, updatedProduct);
        await fetchProducts();
        handleClose();
        
      } catch (error) {
        console.error("Mahsulotni yangilashda xatolik: ", error.response?.data || error);
      }
    }
  };

  const colorOptions = [
    { value: "Oq", label: "Oq" },
    { value: "Qora", label: "Qora" },
    { value: "Sariq", label: "Sariq" },
    { value: "Qizil", label: "Qizil" },
    { value: "Yashil", label: "Yashil" },
    { value: "Ko'k", label: "Ko'k" },
  ];

  return (
    <div className="productPage">
      <ProductForm fetchProducts={fetchProducts} />
      <div className="productList">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="productContainer" key={product.uuid}>
              <img src={`${product.photo}`} alt={product.name} className="productImage" />
              <div className="productDetail">
                <p className="productName">
                  Mahsulot: <strong>{product.name}</strong>
                </p>
                <p>
                  Narxi: <strong>{product.price}</strong>
                </p>
                <p>
                  Kategoriya: <strong>{product.category.name}</strong>
                </p>
                <p>
                  Miqdor: <strong>{product.min_amount}</strong>
                </p>
                <p>
                  Rang: <strong>{product.color}</strong>
                </p>
                <p>
                  Izoh: <strong>{product.bonus}</strong>
                </p>
                <div className="btnContainer">
                  <Button variant="warning" onClick={() => handleShow(product)}>
                    <MdEdit />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => deleteProduct(product.uuid)}
                  >
                    <MdDelete />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="noProducts">Mahsulot topilmadi</p>
        )}

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Mahsulotni Yangilash</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProduct && (
              <Form>
                <Form.Group controlId="formProductName">
                  <Form.Label>Mahsulot nomi</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Mahsulot nomini kiriting"
                    value={selectedProduct.name}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group controlId="formProductPrice">
                  <Form.Label>Mahsulot narxi</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Mahsulot narxini kiriting"
                    value={selectedProduct.price}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        price: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group controlId="formProductCategory">
                  <Form.Label>Kategoriya</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedProduct.category.uuid}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        category: categories.find(cat => cat.uuid === e.target.value),
                      })
                    }
                  >
                    {categories.map((category) => (
                      <option key={category.uuid} value={category.uuid}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formProductMinAmount">
                  <Form.Label>Eng Kam Miqdor</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={selectedProduct.min_amount}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        min_amount: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group controlId="formProductColor">
                  <Form.Label>Rang</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedProduct.color}
                    onChange={handleColorChange}
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
                  <Form.Label>Bonus</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Mahsulot bonusini kiriting"
                    value={selectedProduct.bonus}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        bonus: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group controlId="formProductPhoto">
                  <Form.Label>Mahsulot rasmni kiriting</Form.Label>
                  {selectedProduct.photo && (
                    <img src={selectedProduct.photo} alt="Selected" className="modalImage" />
                  )}
                  <Form.Control type="file" onChange={handlePhotoChange} />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Bekor qilish
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Saqlash
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Product;
