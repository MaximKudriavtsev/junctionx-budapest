import React, { Component } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { getTransactionGroups } from '../../server/logic';
import { Line } from './line';

const wrapperStyles = {
  width: '100%',
  maxWidth: 980,
  backgroundColor: '#1a1a1a',
  margin: '0 auto',
  position: 'relative',
  // marginTop: '100px',
};

class BasicMap extends Component {
  render() {
    const { transactions } = this.props;

    const sortTransactionGroups = getTransactionGroups().sort((a, b) => {
      if (a.count > b.count) {
        return 1;
      }
      if (a.count < b.count) {
        return -1;
      }
      return 0;
    });

    console.log(transactions);
    return (
      <div style={wrapperStyles}>
        {transactions.map(({ id, ...coords }) => (
          <Line
            key={id}
            {...coords}
          />
        ))}
        <ComposableMap
          projectionConfig={{
            scale: 160,
            rotation: [0, 0, 0],
          }}
          width={700}
          height={450}
          style={{
            width: '100%',
            height: 'auto',
          }}
        >
          <ZoomableGroup center={[0, 20]}>
            <Geographies geography="../../static/world.json">
              {(geographies, projection) => geographies.map((geography, i) => {
                const popScale = scaleLinear()
                  .domain([sortTransactionGroups[0].count, sortTransactionGroups[Math.floor(sortTransactionGroups.length / 2)].count, sortTransactionGroups[sortTransactionGroups.length - 1].count])
                  .range(['#000000', '#111', '#fff']);
                // if (geography.properties.iso_a2 === 'RUS') {
                // console.log(`${geography.properties.iso_a2} - ${geography.properties.name}`);

                // }
                // console.log(geography.properties);


                const index = sortTransactionGroups.findIndex(group => group.country === geography.properties.iso_a2);

                return (
                  <Geography
                    key={i}
                    geography={geography}
                    projection={projection}
                    onClick={this.handleClick}
                    style={{
                      default: {
                        // fill: popScale(index === -1 ? 0 : sortTransactionGroups[index].count),
                        fill: '#292929',
                        stroke: '#afdafc',
                        strokeWidth: 0.75,
                        outline: 'none',
                      },
                      hover: {
                        fill: '#263238',
                        stroke: '#607D8B',
                        strokeWidth: 0.75,
                        outline: 'none',
                      },
                      pressed: {
                        fill: '#263238',
                        stroke: '#607D8B',
                        strokeWidth: 0.75,
                        outline: 'none',
                      }
                    }}
                  />
                );
              })}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    );
  }
}

export default BasicMap;
