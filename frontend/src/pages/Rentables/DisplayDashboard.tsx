import Table from "../../components/Table/Table"
import Button from "../../components/Button/Button"
import './UserDashboard.css'

function DisplayDashboard() {
    return (
        <>
            <div className="display-dashboard">
                <Table endpoint="rentables" />
                <Button 
                    variant="primary"
                    label="A button with no function!" />
            </div>
        </>
    )
}

export default DisplayDashboard

