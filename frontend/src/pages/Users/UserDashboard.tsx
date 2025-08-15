/* UserDashboard.tsx
 * This component displays the user dashboard with a table of rentable items.
 */

import Table from "../../components/Table/Table"
import './UserDashboard.css'

function UserDashboard() {
    return (
        <>
            <div className="user-dashboard">
                <Table endpoint="inventory/rentable" />
            </div>
        </>
    )
}

export default UserDashboard
