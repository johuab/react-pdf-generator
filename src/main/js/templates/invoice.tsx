/*
 * Copyright (c) 2022, JOHU AB
 */

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import { Table } from "../components/table";
import { Template } from "./types";

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
  },
  container: {
    height: "90vh",
    margin: "1.5cm",
    fontSize: "12px",
  },
  title: {
    fontSize: "32px",
    marginBottom: "20px",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paragraph: {
    fontSize: "12px",
    paddingBottom: "5px", // TODO: lineHeight does not work? Added bottom padding instead
  },
  logo: {
    width: "15vw",
  },
  headerInfo: {
    padding: "15px",
    paddingBottom: "10px",
    width: "40vw",
    border: "1px solid black",
    borderRadius: "4px",
  },
  headerInfoRow: {
    flexDirection: "row",
    paddingBottom: "5px",
  },
  headerInfoCol: {
    flex: "1",
  },
  receiverHeader: {
    fontSize: "28px",
    marginTop: "30px",
    marginBottom: "10px",
  },
  detailsTable: {
    marginTop: "30px",
    borderTop: "1 px solid black",
    borderBottom: "1 px solid black",
  },
  summaryTable: {
    marginTop: "20px",
  },
  footer: {
    borderTop: "1 px solid black",
    paddingLeft: "15px",
    paddingRight: "15px",
    paddingTop: "15px",
    marginTop: "auto",
    fontSize: "10px",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerItemHeader: {
    fontFamily: "Helvetica-Bold",
    marginBottom: "4px",
  },
});

function formatNumber(n: number): string {
  return n.toFixed(2).replace(".", ",");
}

export interface Invoice  {
  id: number;
  invoiceDate: string;
  expirationDate: string;
  details: {
    description: string;
    cost: number;
    amount: number;
    vat: number;
  }[];
  customer: {
    address: string[];
  };
  sender: {
    title: string;
    logo: string;
    address: string[];
    orgNumber: string;
    bankGiro: string;
  };
}

export const EXAMPLE_INVOICE: Invoice = {
  id: 1,
  invoiceDate: "2022-01-31",
  expirationDate: "2022-04-05",
  details: [{
    description: "Bread and butter",
    cost: 25000,
    amount: 1,
    vat: 0.25,
  }],
  customer: {
    address: [
      "Hungry man",
      "No food street",
      "Mitticity",
    ],
  },
  sender: {
    title: "ACME FOOD",
    logo: "https://image.shutterstock.com/image-vector/white-house-building-icon-washington-260nw-603997673.jpg",
    address: [
      "FOOD LTD",
      "123 My street",
      "Malmö!",
    ],
    orgNumber: "123456-1234",
    bankGiro: "1234-5678",
  },
};

interface Props {
  data: Invoice;
}

export const Invoice: React.FunctionComponent<Props> = (props: Props) => {
  const { id, details, expirationDate, invoiceDate, customer, sender } = props.data;
  const num = id.toString().padStart(4, "0");

  const totalWithoutVat = details.reduce((acc, curr) => {
    return acc + curr.cost * curr.amount;
  }, 0);

  const totalVat = totalWithoutVat * 0.25;

  const totalToPay = totalWithoutVat + totalVat;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <Text style={styles.title}>{sender.title}</Text>
          <View style={styles.header}>
            <View style={styles.logo}>
              <Image src={sender.logo} />
            </View>
            <View>
              <View style={styles.headerInfo}>
                <View style={styles.headerInfoRow}>
                  <Text style={[styles.paragraph, styles.headerInfoCol]}>Fakturanummer</Text>
                  <Text style={[styles.paragraph, styles.headerInfoCol]}>{num}</Text>
                </View>
                <View style={styles.headerInfoRow}>
                  <Text style={[styles.paragraph, styles.headerInfoCol]}>Fakturadatum</Text>
                  <Text style={[styles.paragraph, styles.headerInfoCol]}>{invoiceDate}</Text>
                </View>
                <View style={styles.headerInfoRow}>
                  <Text style={[styles.paragraph, styles.headerInfoCol]}>Förfallodag</Text>
                  <Text style={[styles.paragraph, styles.headerInfoCol]}>{expirationDate}</Text>
                </View>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.receiverHeader}>Mottagare</Text>
            {
              customer.address.map((addressLine, idx) => {
                return (
                  <Text style={styles.paragraph} key={idx}>{addressLine}</Text>
                );
              })
            }
          </View>
          <Table
            style={styles.detailsTable}
            showHeader={true}
            columns={[{
              key: "description",
              label: "Beskrivning",
              width: 40,
              alignment: "left",
            }, {
              key: "price",
              label: "Pris kr",
              width: 15,
              alignment: "right",
            }, {
              key: "amount",
              label: "Antal",
              width: 15,
              alignment: "right",
            }, {
              key: "vat",
              label: "Moms %",
              width: 15,
              alignment: "right",
            }, {
              key: "total",
              label: "Totalt kr",
              width: 15,
              alignment: "right",
            }]}
            rows={details.map((detail) => ({
              description: detail.description,
              price: formatNumber(detail.cost),
              amount: formatNumber(detail.amount),
              vat: formatNumber(detail.vat * 100),
              total: formatNumber(detail.cost * detail.amount),
            }))}
          />
          <Table
            style={styles.summaryTable}
            showHeader={false}
            columns={[{
              key: "padding",
              width: 60,
              alignment: "left",
            }, {
              key: "title",
              width: 25,
              alignment: "left",
            }, {
              key: "amount",
              width: 15,
              alignment: "right",
            }]}
            rows={[{
              title: "Totalt utan moms kr",
              amount: formatNumber(totalWithoutVat),
            }, {
              title: "Moms totalt kr",
              amount: formatNumber(totalVat),
            }, {
              title: "Betalas totalt kr",
              amount: formatNumber(totalToPay),
            }]}
          />
          <View style={styles.footer}>
            <View>
              <Text style={styles.footerItemHeader}>Adress</Text>
              {sender.address.map((a, i) => <Text key={i}>{a}</Text>)}
            </View>
            <View >
              <Text style={styles.footerItemHeader}>Organisationsnummer</Text>
              <Text>{sender.orgNumber}</Text>
            </View>
            <View>
              <Text style={styles.footerItemHeader}>Momsregistreringsnummer</Text>
              <Text>SE{sender.orgNumber.replace("-", "")}01</Text>
            </View>
            <View>
              <Text style={styles.footerItemHeader}>Bankgironummer</Text>
              <Text>{sender.bankGiro}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const invoice: Template<Invoice> = {
  name: "invoice",
  component: Invoice,
  sampleData: EXAMPLE_INVOICE,
};

