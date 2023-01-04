import { useState } from "react";
import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import { format } from "date-fns";

export default function Reservations() {
  let [quotationData, setQuotationData] = useState(null);
  let [quotationData2, setQuotationData2] = useState(null);
  let [quotationData3, setQuotationData3] = useState(null);
  let [quotationData4, setQuotationData4] = useState(null);
  let [quotationData5, setQuotationData5] = useState(null);
  let [quotationData6, setQuotationData6] = useState(null);
  let [quotationDataComplete, setQuotationDataComplete] = useState([]);
  let [quotationUser, setQuotationUser] = useState();
  let [quotationBasic, setQuotationBasic] = useState();
  let [sku, setQuotationSku] = useState();
  let [destinationZipcode, setQuotationZipCode] = useState();
  let [isError, setError] = useState(false);

  const apiCall = (event) => {
    const url = `https://homolog.omniplat.io/v1/clients/${quotationUser}/channels/site/freights`;

    fetch(url, {
      headers: new Headers({
        //Authorization: `${quotationBasic}`,
        Authorization: process.env.NEXT_PUBLIC_LE_AUTH,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        clientId: "lepostiche",
        channelId: "site",
        destinationZipcode: destinationZipcode,
        groups: {
          group1: {
            items: {
              sku: {
                sku: sku,
                quantity: 1,
                price: 99.99,
                basePrice: 99.99,
                weight: 3200.0,
                height: 760.0,
                width: 760.0,
                length: 195.0,
                stockType: "PHYSICAL",
              },
            },
          },
        },
      }),
      method: "POST",
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Dados Incorretos");
        }
      })
      .then(
        (result) => (
          setQuotationData(result.quoteId),
          setQuotationData2(
            result.groups.group1.pickupExceptions[0].locationId
          ),
          setQuotationData3(
            result.groups.group1.pickupExceptions[0].items[0].totalAvailable
          ),
          setQuotationData4(
            result.groups.group1.shipmentExceptions[0].methodName
          ),
          setQuotationData5(result.groups.group1.shipmentExceptions[0].message),
          setQuotationData6(
            result.groups.group1.shipmentExceptions[0].items[0].totalAvailable
          )
        )
      )
      .catch((error) => setError(true));
  };

  return (
    <div>
      <h3 className={styles.title}>Cotação</h3>
      <h2 className={styles.grid}>
        {" "}
        <br />
        <label type="text">
          Client:
          <input
            className={styles.card}
            required={true}
            type="text"
            value={quotationUser}
            onChange={(event) => setQuotationUser(event.target.value)}
          ></input>
        </label>
        <label type="text">
          Basic:
          <input
            className={styles.card}
            required={true}
            type="text"
            value={quotationBasic}
            onChange={(event) => setQuotationBasic(event.target.value)}
          ></input>
        </label>
        <label type="text">
          SKU:
          <input
            className={styles.card}
            required={true}
            type="text"
            value={sku}
            onChange={(event) => setQuotationSku(event.target.value)}
          ></input>
        </label>
        <label type="text">
          CEP:
          <input
            className={styles.card}
            required={true}
            type="text"
            value={destinationZipcode}
            onChange={(event) => setQuotationZipCode(event.target.value)}
          ></input>
        </label>
        <button className={styles.card} onClick={apiCall}>
          Verificar
        </button>
      </h2>

      {/* If ternário abaixo, dentro do HTML única forma de fazer */}

      {isError === true ? (
        <ErrorPage message={`Verifique as Credenciais`}></ErrorPage>
      ) : (
        <div className={styles.grid}>
          <div className={styles.card}>
            <span>QuoteId: {quotationData}</span> <br />
            <span>Pickups:</span> <br />
            <span>Pickup Location: {quotationData2}</span> <br />
            <span>Itens Disponíveis: {quotationData3}</span> <br />
            <span>Shipment:</span> <br />
            <span>Método de Entrega: {quotationData4}</span> <br />
            <span>Mensagem: {quotationData5}</span> <br />
            <span>Total Disponível: {quotationData6}</span> <br />
            <br />
            {quotationDataComplete.map((quote) => (
              <div
                className={styles.card}
                key={quote.groups.group1.shipment.GUID.id}
              >
                <span>Price: {quote.shipment.price}</span> <br />
                <br />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
