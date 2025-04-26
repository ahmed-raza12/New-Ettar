// // admin/src/components/Dashboard/SalesChart.jsx
// import { useEffect, useRef } from 'react';
// import Chart from 'chart.js/auto';

// const SalesChart = () => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const ctx = chartRef.current.getContext('2d');

//     const salesChart = new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
//         datasets: [{
//           label: 'Sales',
//           data: [12000, 19000, 15000, 20000, 18000, 22000, 24000],
//           backgroundColor: 'rgba(166, 138, 100, 0.2)',
//           borderColor: 'rgba(166, 138, 100, 1)',
//           borderWidth: 2,
//           tension: 0.4,
//           fill: true
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             display: false
//           }
//         },
//         scales: {
//           y: {
//             beginAtZero: true,
//             grid: {
//               drawBorder: false
//             },
//             ticks: {
//               callback: function(value) {
//                 return '$' + value.toLocaleString();
//               }
//             }
//           },
//           x: {
//             grid: {
//               display: false
//             }
//           }
//         }
//       }
//     });

//     return () => {
//       salesChart.destroy();
//     };
//   }, []);

//   return <canvas ref={chartRef} style={{ height: '300px' }} />;
// };

// export default SalesChart;