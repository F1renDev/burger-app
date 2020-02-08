import React, { useState, useEffect } from "react";

import Modal from "../../components/UI/Modal/Modal";

const withErrorHandler = (WrappedComponent, axios) => {
  return props => {
    const [error, setError] = useState(null);

    // Setting up axios interceptops to handle errors
    // Clearing the error every time a new request is sent
    const requestInterceptor = axios.interceptors.request.use(request => {
      setError(null);
      return request;
    });

    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      err => {
        setError(err);
      }
    );

    // Deleting the unused interceptors
    //Returning a function in useEffect = clean-up function that runs before 
    //the component unmounts
    useEffect(() => {
      return () => {
        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.response.eject(responseInterceptor);
      };
    }, [requestInterceptor, responseInterceptor]);

    // Closing the Modal when the Backdrop is clicked
    const errorConfirmedHandler = () => {
      setError(null);
    };

    return (
      <React.Fragment>
        {/* Modal is only shown when the error is !null */}
        <Modal modalClosed={errorConfirmedHandler} show={error}>
          {error && error.message}
        </Modal>
        <WrappedComponent {...props} />
      </React.Fragment>
    );
  };
};

export default withErrorHandler;
