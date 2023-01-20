import React from 'react'
import { Marker } from '@react-google-maps/api'

class CustomMarker extends Marker {
  render() {
    return <Marker {...this.props} />
  }
}

export default CustomMarker
