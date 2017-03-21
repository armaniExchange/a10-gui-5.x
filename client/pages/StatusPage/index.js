

import asyncComponent from 'helpers/asyncComponent';

export const PageNotFound = asyncComponent(() =>
  System.import('./not_found').then(module => module.default)
);

// class InternalServerError extends React.Component {
//   render() {
//     return (
//       <div>
//         <h1>Internal Server Error</h1>
//         <p>Go to <Link to="/">Home Page</Link></p>
//       </div>
//     )
//   }
// }

// export {
//   PageNotFound,
//   InternalServerError
// };
