import { ServerRespond } from './DataStreamer';
// This is the declaration of an interface named 'Row'. An interface in TypeScript is a way to define a contract for a certain structure of an object.
export interface Row {
  price_abc: number, // This is a property of the 'Row' interface. It represents the price of the ABC stock.
  price_def: number, // This is a property of the 'Row' interface. It represents the price of the DEF stock.
  ratio: number, // This is a property of the 'Row' interface. It represents the ratio of the prices of the ABC and DEF stocks.
  timestamp: Date, // This is a property of the 'Row' interface. It represents the timestamp of when the data was fetched.
  upper_bound: number, // This is a property of the 'Row' interface. It represents the upper bound of the ratio for triggering an alert.
  lower_bound: number, // This is a property of the 'Row' interface. It represents the lower bound of the ratio for triggering an alert.
  trigger_alert: number | undefined, // This is a property of the 'Row' interface. It represents the value that triggers an alert if the ratio is outside the bounds. It can be 'undefined' if the ratio is within the bounds.
}

// This is the declaration of a class named 'DataManipulator'.
export class DataManipulator {
  // This is a static method of the 'DataManipulator' class. It generates a 'Row' object from an array of 'ServerRespond' objects.
  static generateRow(serverRespond: ServerRespond[]): Row {
    // Calculate the average price of the ABC stock from the top ask price and the top bid price of the first 'ServerRespond' object.
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price)/2;
    // Calculate the average price of the DEF stock from the top ask price and the top bid price of the second 'ServerRespond' object.
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price)/2;
    // Calculate the ratio of the prices of the ABC and DEF stocks.
    const ratio = priceABC / priceDEF
    // Define the upper bound of the ratio for triggering an alert. It is 5% above 1.
    const upperBound = 1 + 0.05;
    // Define the lower bound of the ratio for triggering an alert. It is 5% below 1.
    const lowerBound = 1 - 0.05;
    // Return a 'Row' object with the calculated values and the latest timestamp from the 'ServerRespond' objects.
    return {
        price_abc: priceABC,
        price_def: priceDEF,
        ratio,
        timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
          serverRespond[0].timestamp: serverRespond[1].timestamp,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        // If the ratio is outside the bounds, set 'trigger_alert' to the ratio. Otherwise, set it to 'undefined'.
        trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio: undefined,
    };
  }
}
