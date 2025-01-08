// Configuration
const config = {
    GITHUB_TOKEN: 'your_token_here',
    GITHUB_USERNAME: 'your_username',
    REPO_NAME: 'your_repo_name',
    FILE_PATH: 'inventory.json'
};

// GitHub Database Class
class GitHubDB {
    constructor(config) {
        this.config = config;
        this.baseURL = `https://api.github.com/repos/${config.GITHUB_USERNAME}/${config.REPO_NAME}/contents/${config.FILE_PATH}`;
    }

    async getInventory() {
        try {
            const response = await fetch(this.baseURL, {
                headers: {
                    'Authorization': `token ${this.config.GITHUB_TOKEN}`
                }
            });

            if (response.status === 404) return [];

            const data = await response.json();
            return JSON.parse(atob(data.content));
        } catch (error) {
            console.error('Error fetching inventory:', error);
            return [];
        }
    }

    async saveInventory(inventory) {
        try {
            const currentFile = await fetch(this.baseURL, {
                headers: {
                    'Authorization': `token ${this.config.GITHUB_TOKEN}`
                }
            }).then(res => res.json()).catch(() => null);

            const content = btoa(JSON.stringify(inventory, null, 2));
            
            await fetch(this.baseURL, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.config.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Update inventory',
                    content: content,
                    sha: currentFile?.sha
                })
            });
        } catch (error) {
            console.error('Error saving inventory:', error);
            throw error;
        }
    }
}
