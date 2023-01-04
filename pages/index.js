import { useState } from "react";
import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import { format } from "date-fns";

export default function Reservations() {
  let [quotationData, setQuotationData] = useState(null);
  let [quotationDataComplete, setQuotationDataComplete] = useState([]);
  let [quotationUser, setQuotationUser] = useState();
  let [quotationBasic, setQuotationBasic] = useState();
  let [isError, setError] = useState(false);

  const apiCall = (event) => {
    const url = `https://homolog.omniplat.io/v1/clients/${quotationUser}/channels/site/freights`;

    fetch(url, {
      headers: new Headers({
        Authorization: `${quotationBasic}`,
        //process.env.NEXT_PUBLIC_LE_AUTH,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        clientId: "lepostiche",
        channelId: "site",
        destinationZipcode: "11451365",
        groups: {
          group1: {
            items: {
              4039623006431: {
                sku: "4039623006431",
                quantity: 5,
                price: 99.99,
                basePrice: 99.99,
                weight: 3200.0,
                height: 760.0,
                width: 760.0,
                length: 195.0,
                stockType: "PHYSICAL",
                stockKeepUnitId: 748,
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
      .then((result) => setQuotationData(result.quoteId))
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
            <br />
            {quotationDataComplete.map((quote) => (
              < div
                className={styles.card}
                key={quote.groups.group1.shipment[1]}
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
