import React, { useEffect, useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import "../App.css";
import { MdDelete, MdEditDocument } from "react-icons/md";
import { instance } from "./LInk";
function Category() {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [validated, setValidated] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await instance.get("/get_all_categories");
      setCategories(response.data);

    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (categoryName) {
      try {
        const response = await instance.post("/create_category/", { name: categoryName });
        if (response.status === 201) {
          setCategoryName("");
          setValidated(false);
          fetchData(); // Refresh the category list
        }
      } catch (error) {
        console.error("Error creating category:", error);
        setError("Bu kategorydan   bor");
      }
    } else {
      setValidated(true);
    }
  };

  const handleDelete = async (uuid) => {
    try {
      await instance.delete(`/delete_category/${uuid}/`);
      fetchData();
    } catch (error) {
      console.error("Error deleting category:", error);
      setError(error.response?.data?.detail || "Failed to delete category.");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (editingCategory && editingCategory.name) {
      try {
        await instance.patch(`/update_category/${editingCategory.uuid}/`, { name: editingCategory.name });
        setEditingCategory(null);
        setShowEditModal(false);
        fetchData();
      } catch (error) {
        console.error("Error updating category:", error);
        setError(error.response?.data?.detail || "Failed to update category.");
      }
    }
  };

  return (
    <div className="categoryPage">
      <Form noValidate validated={validated} onSubmit={handleSubmit} className="productForm">
        <Form.Group controlId="categoryName" className="m-3">
          <Form.Label className="textp">Kategoriya</Form.Label>
          <Form.Control
            type="text"
            placeholder="Kategoriya nomini kiriting"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Iltimos kategoriya nomini kiriting
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit" className="m-3 ">
          Saqlash
        </Button>
      </Form>

      <div>
        <h1 className="texth1">Kategoriyalar listi</h1>
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div className="categoryHolder" key={cat.uuid}>
              <div>
                <p>{cat.name}</p>
              </div>
              <div className="btnContainer">
                <Button className="updateBtn" variant="warning" onClick={() => handleEdit(cat)}>
                  <MdEditDocument />
                </Button>
                <Button className="deleteBtn" variant="danger" onClick={() => handleDelete(cat.uuid)}>
                  <MdDelete />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="textp">Kategoriyalar topilmadi</p>
        )}
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Kategoriya yangilash</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={handleEditSubmit}>
            <Form.Group controlId="editCategoryName">
              <Form.Label>Kategoriya</Form.Label>
              <Form.Control
                type="text"
                placeholder="Kategoriya nomini kiriting"
                value={editingCategory?.name || ""}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                  })
                }
                required
              />
              <Form.Control.Feedback type="invalid">
                Iltimos kategoriya nomini kiriting
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Yangilash
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Display error message */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default Category;
