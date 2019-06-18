import React from "react";

import Modal from "../../components/UI/Modal/Modal";

/* Error handling */

const withErrorHandler = (WrappedComponent, axios) => {
    
    return class Err extends React.Component {
        state = {
            error: null
        };


        /* Setting up axios interceptops to handle errors */
        componentDidMount() {

            /* Clearing the state.error every time a new request is sent */
            axios.interceptors.request.use((request) => {
                this.setState({ error: null });
                return request;
            });


            axios.interceptors.response.use(response => response, (error) => {
                this.setState({ error: error });
            });
        }

        /* Closing the Modal when the Backdrop is clicked */
        errorConfirmedHandler = () => {
            this.setState({ error: null });
        };

        render() {
            return (
                <React.Fragment>
                    {/* Modal is only shown when the state.error is !null */}
                    <Modal
                        modalClosed={this.errorConfirmedHandler}
                        show={this.state.error}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal> 
                    {/*Distributing the possible props of the WrappedComponent*/}
                    <WrappedComponent {...this.props} /> 
                </React.Fragment>
            );
        }
    };
};

export default withErrorHandler;
