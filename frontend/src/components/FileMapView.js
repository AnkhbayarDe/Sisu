// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const customIcon = new L.Icon({
//   iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const MapView = () => {
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFiles = async () => {
//       const res = await axios.get(`${process.env.REACT_APP_API_URL}/files`);
//       setFiles(res.data);
//     };
//     fetchFiles();
//   }, []);

//   return (
//     <MapContainer center={[47.9189, 106.917]] zoom={12} style={{ height: '100vh', width: '100%' }}>
//       <TileLayer
//         url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
//         attribution='&copy; OpenStreetMap contributors'
//       />
//       {files.map((file) => (
//         <Marker
//           key={file._id}
//           position={[file.location.lat, file.location.lng]}
//           icon={customIcon}
//         >
//           <Popup>
//             <strong>{file.filename}</strong>
//             <br />
//             Uploaded at: {new Date(file.uploadedAt).toLocaleString()}
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// };

// export default MapView;
