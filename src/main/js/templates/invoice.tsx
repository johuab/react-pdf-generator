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
import { NeverError } from "../utils/never-error";

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
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    borderTop: "1 px solid black",
  },
  footerCol: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingLeft: "15px",
    paddingRight: "15px",
    fontSize: "10px",
  },
  footerItemHeader: {
    fontFamily: "Helvetica-Bold",
    marginBottom: "4px",
    marginTop: "15px",
  },
});

function formatNumber(n: number): string {
  return n.toFixed(2).replace(".", ",");
}

type Locale = "se" | "en";
const DEFAULT_LOCALE = "se";

export interface Invoice  {
  locale?: Locale;
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
    bic?: string;
    iban?: string;
  };
}

export const EXAMPLE_INVOICE: Invoice = {
  locale: "se",
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
    bic: "NDEASESS",
    iban: "SE56 9500 0099 6042 1992 9199",
  },
};

interface Props {
  data: Invoice;
}

const translate = (key: string, locale: Locale): string => {
  switch (key) {
    case "invoicenumber":
      switch (locale) {
        case "se":
          return "Fakturanummer";
        case "en":
          return "Invoice number";
        default:
          throw new NeverError(locale);
      }
    case "invoicedate":
      switch (locale) {
        case "se":
          return "Fakturadatum";
        case "en":
          return "Invoice date";
        default:
          throw new NeverError(locale);
      }
    case "paymentdue":
      switch (locale) {
        case "se":
          return "Förfallodag";
        case "en":
          return "Payment due";
        default:
          throw new NeverError(locale);
      }
      case "billto":
        switch (locale) {
          case "se":
            return "Mottagare";
          case "en":
            return "Bill to";
          default:
            throw new NeverError(locale);
        }
      case "description":
        switch (locale) {
          case "se":
            return "Beskrivning";
          case "en":
            return "Description";
          default:
            throw new NeverError(locale);
        }
      case "price":
        switch (locale) {
          case "se":
            return "Pris kr";
          case "en":
            return "Price SEK";
          default:
            throw new NeverError(locale);
        }
      case "amount":
        switch (locale) {
          case "se":
            return "Antal";
          case "en":
            return "Amount";
          default:
            throw new NeverError(locale);
        }
      case "vat":
        switch (locale) {
          case "se":
            return "Moms %";
          case "en":
            return "VAT (%)";
          default:
            throw new NeverError(locale);
        }
      case "total":
        switch (locale) {
          case "se":
            return "Totalt kr";
          case "en":
            return "Total (SEK)";
          default:
            throw new NeverError(locale);
        }
      case "subtotal":
        switch (locale) {
          case "se":
            return "Totalt utan moms kr";
          case "en":
            return "Subtotal (SEK)";
          default:
            throw new NeverError(locale);
        }
      case "vattotal":
        switch (locale) {
          case "se":
            return "Moms totalt kr";
          case "en":
            return "VAT total (SEK)";
          default:
            throw new NeverError(locale);
        }
      case "fulltotal":
        switch (locale) {
          case "se":
            return "Betalas totalt kr";
          case "en":
            return "Total (SEK)";
          default:
            throw new NeverError(locale);
        }
      case "bgnr":
        return "Bankgironummer";
      case "bic":
        return "BIC";
      case "iban":
        return "IBAN";
      case "address":
        switch (locale) {
          case "se":
            return "Adress";
          case "en":
            return "Address";
          default:
            throw new NeverError(locale);
        }
      case "orgnumber":
        switch (locale) {
          case "se":
            return "Organisationsnummer";
          case "en":
            return "Reg. nr.";
          default:
            throw new NeverError(locale);
        }
      case "vatnumber":
        switch (locale) {
          case "se":
            return "Momsregistreringsnummer";
          case "en":
            return "Tax. nr.";
          default:
            throw new NeverError(locale);
        }
    default:
      throw new Error("Illegal key " + key);
  }
};

export const Invoice: React.FunctionComponent<Props> = (props: Props) => {
  const { id, details, expirationDate, invoiceDate, customer, sender, locale: l } = props.data;
  const locale: Locale = l || DEFAULT_LOCALE;
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
                  <Text style={[styles.paragraph, styles.headerInfoCol]}>{translate("invoicenumber", locale)}</Text>
                  <Text style={[styles.paragraph, styles.headerInfoCol]}>{num}</Text>
                </View>
                <View style={styles.headerInfoRow}>
                  <Text style={[styles.paragraph, styles.headerInfoCol]}>{translate("invoicedate", locale)}</Text>
                  <Text style={[styles.paragraph, styles.headerInfoCol]}>{invoiceDate}</Text>
                </View>
                <View style={styles.headerInfoRow}>
                  <Text style={[styles.paragraph, styles.headerInfoCol]}>{translate("paymentdue", locale)}</Text>
                  <Text style={[styles.paragraph, styles.headerInfoCol]}>{expirationDate}</Text>
                </View>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.receiverHeader}>{translate("billto", locale)}</Text>
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
              label: translate("description", locale),
              width: 40,
              alignment: "left",
            }, {
              key: "price",
              label: translate("description", locale),
              width: 15,
              alignment: "right",
            }, {
              key: "amount",
              label: translate("amount", locale),
              width: 15,
              alignment: "right",
            }, {
              key: "vat",
              label: translate("vat", locale),
              width: 15,
              alignment: "right",
            }, {
              key: "total",
              label: translate("total", locale),
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
              title: translate("subtotal", locale),
              amount: formatNumber(totalWithoutVat),
            }, {
              title: translate("vattotal", locale),
              amount: formatNumber(totalVat),
            }, {
              title: translate("fulltotal", locale),
              amount: formatNumber(totalToPay),
            }]}
          />
          <View style={styles.footer}>
            <View style={styles.footerCol}>
              <View style={locale !== "se" ? {color: "white"} : {}}>
                <Text style={styles.footerItemHeader}>{translate("bgnr", locale)}</Text>
                <Text>{sender.bankGiro}</Text>
              </View>
              <View>
                <Text style={styles.footerItemHeader}>{translate("address", locale)}</Text>
                {sender.address.map((a, i) => <Text key={i}>{a}</Text>)}
              </View>
            </View>
            <View style={styles.footerCol}>
              <View style={sender.bic ? {} : {color: "white"} }>
                <Text style={styles.footerItemHeader}>{translate("bic", locale)}</Text>
                  <Text>{sender.bic || ""}</Text>
                </View>
               <View >
                <Text style={styles.footerItemHeader}>{translate("orgnumber", locale)}</Text>
                <Text>{sender.orgNumber}</Text>
              </View>
            </View>
            <View style={styles.footerCol}>
              <View style={sender.iban ? {} : {color: "white"} }>
                <Text style={styles.footerItemHeader}>{translate("iban", locale)}</Text>
                <Text>{sender.iban}</Text>
              </View>
              <View>
                <Text style={styles.footerItemHeader}>{translate("vatnumber", locale)}</Text>
                <Text>SE{sender.orgNumber.replace("-", "")}01</Text>
              </View>
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

