import React from 'react';
import {FormGroup, Label ,Input} from 'reactstrap';

const Conditions = (props)=>{
   
    return (
        <div className="m-4">
            <h1>Conditions d'utilisation et traitement des donnees</h1>
            <p style={{color:'#0f0'}}>
            These Terms of Service (“Terms”) are a contract between you and A Medium Corporation. They govern your use of Medium’s sites, services, mobile apps, products, and content (“Services”).

By using Medium, you agree to these Terms. If you don’t agree to any of the Terms, you can’t use Medium.

We can change these Terms at any time. We keep a historical record of all changes to our Terms on GitHub. If a change is material, we’ll let you know before they take effect. By using Medium on or after that effective date, you agree to the new Terms. If you don’t agree to them, you should delete your account before they take effect, otherwise your use of the site and content will be subject to the new Terms.
These Terms of Service (“Terms”) are a contract between you and A Medium Corporation. They govern your use of Medium’s sites, services, mobile apps, products, and content (“Services”).

By using Medium, you agree to these Terms. If you don’t agree to any of the Terms, you can’t use Medium.

We can change these Terms at any time. We keep a historical record of all changes to our Terms on GitHub. If a change is material, we’ll let you know before they take effect. By using Medium on or after that effective date, you agree to the new Terms. If you don’t agree to them, you should delete your account before they take effect, otherwise your use of the site and content will be subject to the new Terms.
            </p>
            <FormGroup check>
                <Label check>
                <Input type="checkbox" onClick={props.onClick}/>{' '}
                  I'm aggree   <br></br>
                {/* <Button color="secondary" style={{margin:5}} onClick={}>Learn more about our policy</Button> */}
                </Label>
            </FormGroup>

        </div>
    )
}

export default Conditions;