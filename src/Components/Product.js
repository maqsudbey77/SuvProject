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
        console.error("Error while fetching products: ", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await instance.get("/get_all_categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error while fetching categories: ", error);
      }
    };

    const deleteProduct = async (uuid) => {
      try {
        await instance.delete(`/delete_product/${uuid}`);
        fetchProducts();
      } catch (error) {
        console.error("Error while deleting product: ", error);
      }
    };

    const handleShow = (product) => {
      setSelectedProduct(product);
      setPhoto(product.photo || ""); // Initial photo state
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
        setPhoto(null);
      }
    };

    const handleSaveChanges = async () => {
      if (selectedProduct) {
        try {
          const updatedProduct = {
            ...selectedProduct,
            photo: photo,
          };

          await instance.patch(`/update_product/${selectedProduct.uuid}/`, updatedProduct);
          await fetchProducts();
          handleClose();
        } catch (error) {
          console.error("Error while updating product: ", error);
        }
      }
    };

    return (
      <div className="productPage">
        <ProductForm fetchProducts={fetchProducts} />
        <div className="productList">
          <h1>Mahsulotlar ro'yhati</h1>
          {products.length > 0 ? (
            products.map((product) => (
              <div className="productContainer" key={product.uuid}>
                <img src={`${product.photo}`} alt={product.name} />
                <div className="productDetail">
                  <p>
                    Mahsulot: <strong>{product.name}</strong>
                  </p>
                  <p>
                    Narxi: <strong>{product.price}</strong>
                  </p>
                  <p>
                    Kategoriya: <strong>{product.category?.name}</strong>
                  </p>
                  <p>
                    Eng Kam Miqdor: <strong>{product.min_amount}</strong>
                  </p>
                  <p>
                    Rang: <strong>{product.color}</strong>
                  </p>
                  <p>
                    Bonus: <strong>{product.bonus}</strong>
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
            <p>Mahsulot topilmadi</p>
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
                      value={selectedProduct.category_id}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          category_id: e.target.value,
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
                      type="text"
                      placeholder="Rangni kiriting (hex format)"
                      value={selectedProduct.color}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          color: e.target.value,
                        })
                      }
                    />
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
                    <Form.Label>Mahsulot rasm</Form.Label>
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
