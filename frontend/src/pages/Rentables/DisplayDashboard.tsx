import Button from "../../components/Button/Button"
import './DisplayDashboard.css'
import RentablesTable from "../../components/Table/RentablesTable"

function DisplayDashboard() {
    return (
        <>
            <div className="display-dashboard">
                <RentablesTable />
                <Button 
                    variant="primary"
                    label="A button with no function!" />
            </div>
        </>
    )
}

export default DisplayDashboard

