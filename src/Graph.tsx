import React, { Component } from 'react';
import { Table, TableData } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      // The 'price_abc' field represents the price of the stock ABC. It's a floating point number.
      price_abc: 'float', 

      // The 'price_def' field represents the price of the stock DEF. It's a floating point number.
      price_def: 'float', 

      // The 'ratio' field represents the ratio of the prices of the two stocks (ABC/DEF). It's a floating point number.
      ratio: 'float',

      // The 'timestamp' field represents the time when the data was recorded. It's a date.
      timestamp: 'date',

      // The 'upper_bound' field represents the upper bound of the trigger alert. It's a floating point number.
      upper_bound: 'float', 

      // The 'lower_bound' field represents the lower bound of the trigger alert. It's a floating point number.
      lower_bound: 'float', 

      // The 'trigger_alert' field represents the trigger point for an alert. It's a floating point number.
      trigger_alert: 'float',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // If the table was successfully created, load it into the perspective viewer element.
      // Also, set the necessary attributes for the perspective viewer.

      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);

      // Set the view to 'y_line' which means it will create a line chart.
      elem.setAttribute('view', 'y_line');

      // Set the row pivot to 'timestamp'. This means the data will be grouped by the 'timestamp' field.
      elem.setAttribute('row-pivots', '["timestamp"]');

      // Set the columns that will be displayed in the chart.
      elem.setAttribute('columns', '["ratio","upper_bound","lower_bound","trigger_alert"]');

      // Set the aggregate functions for each column. This is how each column will be aggregated.
      elem.setAttribute('aggregates', JSON.stringify({
        price_abc: 'avg', 
        price_def: 'avg', 
        ratio: 'avg',
        timestamp: 'distinct_count',
        upper_bound: 'avg', 
        lower_bound: 'avg', 
        trigger_alert: 'avg',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([
        DataManipulator.generateRow(this.props.data),
      ]as unknown as TableData);
    }
  }
}

export default Graph;
