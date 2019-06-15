import React from 'react';
import styles from './Modal.module.css'
import Backdrop from '../Backdrop/Backdrop';

class Modal extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
            return nextProps.show !== this.props.show;
    }

    render() {
        return (
            <React.Fragment>
                <Backdrop clicked={this.props.modalClosed} show={this.props.show}/>
                <div
                    className={styles.modal}
                    style={{
                        transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: this.props.show ? '1' : '0',
                    }}
                >
                    {this.props.children}
                </div>
            </React.Fragment>);
    }
}

export default Modal;