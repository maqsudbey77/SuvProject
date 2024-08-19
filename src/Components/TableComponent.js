import "../App.css";
import { Table, Form, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { instance } from "./LInk";

function TableComponent() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState({
    product: "",
    quantity: "",
    cost: "",
    full_name: "",
    phone_number: "",
    created_at: null,
    worker_fullname: "",
  });

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const params = {};

      if (filter.product) params.product = filter.product;
      if (filter.quantity) params.amount = filter.quantity;
      if (filter.full_name) params.client_fullname = filter.full_name;
      if (filter.phone_number) params.client_phone_number = filter.phone_number;
      if (filter.created_at) params.created_at = format(filter.created_at, "yyyy-MM-dd");
      if (filter.cost) params.product_price = filter.cost;
      if (filter.worker_fullname) params.worker_fullname = filter.worker_fullname;

      const response = await instance.get("/get_all_order/", { params });
      setOrders(response.data.orders);
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
      (filter.worker_fullname === "" || order.worker_fullname.includes(filter.worker_fullname)) &&
      (selectedDate === "" || formattedDate === selectedDate)
    );
  });

  const totalCost = filteredOrders.reduce((acc, order) => acc + order.product.price * order.amount, 0);

  return (
    <div className="App">
      <p className="textp">Qidirish</p>
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
                <Form.Label>Ishchi Ismi</Form.Label>
                <Form.Control
                  type="text"
                  name="worker_fullname"
                  value={filter.worker_fullname}
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
      <Table>
        <thead className="thead">
          <tr>
            <th>#</th>
            <th>MAHSULOT NOMI</th>
            <th>MIQDORI</th>
            <th>NARXI {totalCost}</th>
            <th>ISHCHI ISMI</th>
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
              <td>{order.client_fullname}</td>
              <td>{order.client_phone_number}</td>
              <td>{format(new Date(order.created_at), "yyyy-MM-dd HH:mm")}</td>
              <td>{order.already_ordered ? "HA" : "YO'Q"}</td>

            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default TableComponent;
