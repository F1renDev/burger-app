import React from "react";

import styles from './ContactData.module.css';
import Button from '../../../components/UI/Button/Button';

/* ContactData component to get the user info before placing an order */

class ContactData extends React.Component {
    state = {
        name: "",
        email: "",
        phone: "",
        adress: {
            street: "",
            apartment: ""
        }
    };

    render() {
        return (
            <div className={styles.contactData}>
                <h4>Enter your contact data</h4>
                <form>
                    <input type="text" name="name" placeholder="Your Name" />
                    <input type="email" name="email" placeholder="Your Mail" />
                    <input type="tel" name="phone" placeholder="Your Phone Number" pattern="[0-9]{3}[0-9]{2}[0-9]{2}[0-9]{2}" />
                    <input type="text" name="street" placeholder="Street" />
                    <input type="number" name="apartment" placeholder="Apartment" /><br />
                    <Button btnType='success'>ORDER</Button>
                </form>
            </div>
        );
    }
}

export default ContactData;
