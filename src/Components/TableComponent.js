import "../App.css";
import { Table, Form, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns"; // Import date-fns for date formatting
import DatePicker from "react-datepicker"; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles
import { instance } from "./LInk";

function TableComponent() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState({
    product: "",
    quantity: "",
    cost: "",
    full_name: "",
    phone_number: "",
    created_at: null, // Initialize as null for date picker
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await instance.get(
        "/get_all_order/"
      );
      setOrders(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error while fetching data: ", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      created_at: date,
    }));
  };

  const created_atDates = [
    ...new Set(
      orders.map((order) => format(new Date(order.created_at), "yyyy-MM-dd"))
    ),
  ];

  const filteredOrders = orders.filter((order) => {
    const formattedDate = format(new Date(order.created_at), "yyyy-MM-dd");
    const selectedDate = filter.created_at
      ? format(filter.created_at, "yyyy-MM-dd")
      : "";
    return (
      (filter.product === "" || order.product.name.includes(filter.product)) &&
      (filter.quantity === "" || order.amount === Number(filter.quantity)) &&
      (filter.cost === "" || order.product.price === Number(filter.cost)) &&
      (filter.full_name === "" || order.worker_fullname.includes(filter.full_name)) &&
      (filter.phone_number === "" ||
        order.client_phone_number.includes(filter.phone_number)) &&
      (selectedDate === "" || formattedDate === selectedDate)
    );
  });

  const totalCost = filteredOrders.reduce((acc, order) => acc + order.cost, 0);

  return (
    <div className="App">
      <div className="filterContainer">
        <Form>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Mahsulot Nomi</Form.Label>
                <Form.Control
                  type="text"
                  name="product"
                  value={filter.product}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Miqdori</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={filter.quantity}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Narxi</Form.Label>
                <Form.Control
                  type="number"
                  name="cost"
                  value={filter.cost}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Buyurtmachini Ismi</Form.Label>
                <Form.Control
                  type="text"
                  name="full_name"
                  value={filter.full_name}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Telefon Raqami</Form.Label>
                <Form.Control
                  type="text"
                  name="phone_number"
                  value={filter.phone_number}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Ro'yxatga olingan sanasi</Form.Label>
                <DatePicker
                  selected={filter.created_at}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Pick a date"
                  className="form-control"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>MAHSULOT NOMI</th>
            <th>MIQDORI</th>
            <th>NARXI(SO'M) {totalCost}</th>
            <th>BUYURTMACHINI ISMI</th>
            <th>TELEFON RAQAMI</th>
            <th>RO'YXATGA OLINGAN SANA</th>
            <th>OLDIN BUYURTMA BERIGANMI</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, id) => (
            <tr key={id}>
              <td>{id + 1}</td>
              <td>{order.product.name}</td>
              <td>{order.amount}</td>
              <td>{order.product.price}</td>
              <td>{order.worker_fullname}</td>
              <td>{order.client_phone_number}</td>
              <td>{format(new Date(order.created_at), "yyyy-MM-dd HH:mm")}</td>
              <td>{order.old_customer ? "HA" : "YO'Q"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default TableComponent;
