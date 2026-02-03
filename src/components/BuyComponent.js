export default function ({ stock, closeBuy }) {
  //   console.log("Stock received:", stock);
  return (
    <div className="buy-component">
      <div>
        <p>{stock.name}</p>
      </div>
      <div>
        <p>{stock.price}</p>
      </div>
    </div>
  );
}
