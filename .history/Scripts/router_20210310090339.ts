(function (core) {
    class Router {

        private m_activeLink: string;
        private m_routingTable: string[];
        // Constructors
        constructor() 
        {
            this.ActiveLink = "";
        }

        // Public Properties
        get ActiveLink() 
        {
            return this.m_activeLink;
        }

        set ActiveLink(link: string) 
        {
            this.m_activeLink = link;
        }

        // Private Methods

        // Publics Methods
        /**
         * Add(string) - Adds a new Route to the routing table
         * @param {string} route 
         * @returns {void} 
         */
        public Add(route: string): void
        {
            this.m_routingTable.push(route);
        }

        /**
         * AddTable(string[]) - Replaces the routing table with a new
         *                    one. Routes should being with a / char.
         * @param {string[]} routingTable 
         * @returns {void}
         */
        public AddTable(routingTable: string[]): void
        {
            this.m_routingTable = routingTable;
        }

        /**
         * Find(string) - This method finds the index of a particular
         *              route that is in the table. Otherwise returns
         *              -1.
         * @param {string} route 
         * @returns {number}
         */
        public Find(route: string): string
        {
            return this.m_routingTable.indexOf(route);
        }

        /**
         * Remove(string) - This method removes a route from the Routing
         *                Table. Returns true if a route was removed, false
         *                otherwise.
         * @param {string} route 
         * @returns {boolean} 
         */
        public Remove(route): boolean
        {
            if (this.Find(route) > -1) 
            {
                this.m_routingTable = this.m_routingTable.splice(this.Find(route), 1);
                return true;
            }
            return false;
        }

        /**
         * ToString() - Returns the Routing Table as a comma separated
         *            String.
         * @returns {string} 
         */
        ToString() 
        {
            return this.m_routingTable.toString();
        }

    }
    core.Router = Router;
})(core || (core = {}));

let router = new core.Router();

router.AddTable(["/", 
                "/home", 
                "/about", 
                "/services", 
                "/contact",
                "/contact-list", 
                "/projects", 
                "/register", 
                "/login", 
                "/edit"]);

// Create an Alias for location.Pathname                 
let route = location.pathname;    

if(router.Find(route) > -1)
{
    router.ActiveLink = (route == "/") ? "home" : route.substring(1);
}                 
else
{
    router.ActiveLink = "404";
}
