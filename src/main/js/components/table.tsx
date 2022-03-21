/*
 * Copyright (c) 2022, JOHU AB
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";

interface Tablecolumn {
  width: number;
  alignment: "left" | "right" | "center";
  key: string;
  label?: string;
}

interface TableRow {
  [Key: string]: string | number;
}

interface Props {
  style?: Style;
  showHeader: boolean;
  columns: Tablecolumn[];
  rows: TableRow[];
}

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "5px",
    marginBottom: "5px",
  },
  tableHeader: {
    fontFamily: "Helvetica-Bold",
  },
});

export const Table = (props: Props) => {
  const {columns, rows, style, showHeader} = props;
  const containerStyle: Style[] = [styles.tableContainer];
  if (style) {
    containerStyle.push(style);
  }
  return (
    <View style={containerStyle}>
      {showHeader && (
        <View style={[styles.tableRow, styles.tableHeader]}>
          {columns.map((column) => (
            <Text
              style={{width: `${column.width}%`, textAlign: column.alignment}}
              key={column.key}
            >
              {column.label}
            </Text>
          ))}
        </View>
      )}
      {rows.map((row, i) => (
        <View key={i} style={styles.tableRow}>
          {columns.map((column) => (
            <Text
              style={{width: `${column.width}%`, textAlign: column.alignment}}
              key={`${column.key}_${i}`}
            >
              {row[column.key]}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};
