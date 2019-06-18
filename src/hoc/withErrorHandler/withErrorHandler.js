import React from "react";

import Modal from "../../components/UI/Modal/Modal";

/* Error handling */

const withErrorHandler = (WrappedComponent, axios) => {
    return class Err extends React.Component {
        /* Constructor used to aviod using the deprecated componentWillUpdate hook */
        /* And I needed that hook bacuse the componentDidMount is no longer sutable here */
        /* Because componentDidMount is called after all child components are rendered and their */
        /* componentDidMount was called */

        constructor() {
            super();
            /* Setting up axios interceptops to handle errors */
            /* Clearing the state.error every time a new request is sent */

            this.requestInterceptor = axios.interceptors.request.use((request) => {
                this.setState({ error: null });
                return request;
            });

            this.responseInterceptor = axios.interceptors.response.use(
                (response) => response,
                (error) => {
                    this.setState({ error: error });
                }
            );

            this.state = {
                error: null
            };
        }

        /* Deleting the unused interceptors */
        /* !Can also be done with the lifecycle hooks! */
        componentWillUnmount(){
            axios.interceptors.request.eject(this.requestInterceptor);
            axios.interceptors.response.eject(this.responseInterceptor);
        }

        // componentWillMount() {
        //     axios.interceptors.request.use((request) => {
        //         this.setState({ error: null });
        //         return request;
        //     });
        //     axios.interceptors.response.use(response => response, (error) => {
        //         this.setState({ error: error });
        //     });
        // }

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
