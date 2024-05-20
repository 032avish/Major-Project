import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 5,
    fontSize: 10, // Adjust the font size as needed
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderCollapse: 'collapse',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    padding: 5,
  },
  heading: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 10,
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 10,
  },
});

const MyDocument2 = ({ droppedItemsMap }) => {
  // Separate calculation logic from rendering
  const calculateValues = (item) => {
    const protein = ((item.Protein / 100) * item.consumedQuantity).toFixed(2);
    const carbohydrate = ((item.Carbohydrate / 100) * item.consumedQuantity).toFixed(2);
    const calorie = ((item.Calorie / 100) * item.consumedQuantity).toFixed(2);
    return { protein, carbohydrate, calorie };
  };

  // Get the last thirty keys from droppedItemsMap
  const lastThirtyKeys = Array.from(droppedItemsMap.keys()).slice(-30);

  // Create a new map with only the last thirty keys and their corresponding values
  const lastThirtyItemsMap = new Map(
    lastThirtyKeys.map((key) => {
      return [key, droppedItemsMap.get(key)];
    })
  );
  return (
    <Document>
      {Array.from(lastThirtyItemsMap.keys()).map((date, index) => (
        <Page key={index} style={styles.page}>
          <View>
            <Text style={styles.heading}>Monthly Report</Text>
            <View style={styles.underline}></View>
          </View>
          <Text style={styles.header}>Date: {date}</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Item</Text>
              <Text style={styles.tableCell}>Type</Text>
              <Text style={styles.tableCell}>Protein</Text>
              <Text style={styles.tableCell}>Carbohydrate</Text>
              <Text style={styles.tableCell}>Calorie</Text>
              <Text style={styles.tableCell}>Consumed Quantity</Text>
            </View>
            {lastThirtyItemsMap.get(date).map((item, i) => {
              const { protein, carbohydrate, calorie } = calculateValues(item);

              return (
                <View key={i} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.FOOD_ITEMS}</Text>
                  <Text style={styles.tableCell}>{item.Type}</Text>
                  <Text style={styles.tableCell}>{protein}</Text>
                  <Text style={styles.tableCell}>{carbohydrate}</Text>
                  <Text style={styles.tableCell}>{calorie}</Text>
                  <Text style={styles.tableCell}>{item.consumedQuantity} {item.Term}</Text>
                </View>
              );
            })}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default MyDocument2;
