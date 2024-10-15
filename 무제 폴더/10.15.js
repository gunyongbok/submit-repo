const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const order = async (req, res) => {
  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } =
    req.body;

  let delivery_id;
  let order_id;

  let sql = "INSERT INTO delivery (address, receiver, contact) VALUES (?,?,?)";
  let values = [delivery.adress, delivery.receiver, delivery.contact];
  let [results] = await conn.execute(sql, values);
  delivery_id = results.insertId;

  sql = `SELECT book_id, quantitiy FROM cartItems WHERE id IN (?)`;
  let orderItems = await conn.query(sql, [items]);

  sql =
    "INSERT INTO orders (book_title, total_quantity, totla_price, user_id, delivery_id) VALUES (?,?,?,?,?)";
  values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];

  [results] = await conn.execute(sql, values);
  order_id = results.insertId;

  sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;

  values = [];
  items.forEach((item) => {
    values.push([order_id, item.book_id, item.quantity]);
  });

  [results] = await conn.execute(sql, [values]);

  let result = deleteCartItems(conn, items);

  return res.status(StatusCodes.OK).json(results);
};

const deleteCartItems = async (req, res) => {
  let sql = `DELETE FROM cartItems WHERE id IN (?)`;
  let values = [1, 2, 3];

  let result = await conn.query(sql, values);
  return result;
};

const getOrders = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "book_shop",
  });

  let sql = `SELECT orders.id, book_title, total_quantity, total_price, created_at,
                    address, receiver, contract
                    FROM orders LEFT JOIN delivery
                    ON orders.delivery_id = delivery.id;`;
  let [rows, fileds] = await conn.query(sql);
  return res.status(StatusCodes.Ok);
};

const getOrderDetail = async (req, res) => {
  const { id } = req.params;

  const conn = await mariadb.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "book_shop",
  });

  let sql = `SELECT book.id, title, author, price, quantity,
                        FROM orderedBook LEFT JOIN books
                        ON orderedBook.book_id = books.id
                        WHERE order_id = ?;`;
  let [rows, fileds] = await conn.query(sql, [id]);
  return res.status(StatusCodes.Ok);
};

module.exports = { order, getOrderDetail, getOrders };
