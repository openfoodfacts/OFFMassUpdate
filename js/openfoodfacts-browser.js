/**
 * Browser-compatible OpenFoodFacts API wrapper
 * Based on @openfoodfacts/openfoodfacts-nodejs but adapted for browser extensions
 */

class OpenFoodFactsBrowser {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || `https://${options.country || 'world'}.openfoodfacts.org`;
        this.language = options.language || 'en';
        this.country = options.country || 'world';
        this.userAgent = 'OFFMassUpdate Browser Extension v1.0.0';
    }

    /**
     * Get a product by barcode
     * @param {string} barcode - Product barcode
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Product data
     */
    async getProduct(barcode, options = {}) {
        const fields = options.fields || 'all';
        const url = `${this.baseUrl}/api/v0/product/${barcode}.json?fields=${fields}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': this.userAgent
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                data: data.product ? data : null,
                error: data.status === 0 ? 'Product not found' : null
            };
        } catch (error) {
            return {
                data: null,
                error: error.message
            };
        }
    }

    /**
     * Update or add a product
     * @param {string} barcode - Product barcode
     * @param {Object} productData - Product data to update
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Update result
     */
    async updateProduct(barcode, productData, options = {}) {
        const url = `${this.baseUrl}/cgi/product_jqm2.pl`;
        
        // Build form data
        const formData = new URLSearchParams();
        formData.append('code', barcode);
        formData.append('lc', options.language || this.language);
        
        // Add comment if provided
        if (options.comment) {
            formData.append('comment', options.comment);
        }
        
        // Add all product data fields
        Object.entries(productData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': this.userAgent
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.text();
            return {
                success: true,
                data: result,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                error: error.message
            };
        }
    }

    /**
     * Get product suggestions for autocomplete
     * @param {string} field - Field to get suggestions for
     * @param {string} term - Search term
     * @returns {Promise<Array>} Suggestions array
     */
    async getSuggestions(field, term) {
        const url = `${this.baseUrl}/cgi/suggest.pl?tagtype=${field}&term=${encodeURIComponent(term)}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': this.userAgent
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data || [];
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            return [];
        }
    }

    /**
     * Get ingredients text for a product in a specific language
     * @param {string} barcode - Product barcode
     * @param {string} language - Language code
     * @returns {Promise<string>} Ingredients text
     */
    async getProductIngredients(barcode, language = null) {
        const lang = language || this.language;
        const url = `${this.baseUrl}/api/v0/product/${barcode}?fields=ingredients_text_${lang}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': this.userAgent
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const fieldName = `ingredients_text_${lang}`;
            
            return data.product && data.product[fieldName] ? data.product[fieldName] : '';
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            return '';
        }
    }

    /**
     * Search for products
     * @param {Object} query - Search query parameters
     * @returns {Promise<Object>} Search results
     */
    async search(query) {
        const params = new URLSearchParams();
        
        // Map common search parameters
        Object.entries(query).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                params.append(key, value);
            }
        });

        // Set default format to JSON
        if (!params.has('json')) {
            params.set('json', '1');
        }

        const url = `${this.baseUrl}/cgi/search.pl?${params.toString()}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': this.userAgent
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                data: data,
                error: null
            };
        } catch (error) {
            return {
                data: null,
                error: error.message
            };
        }
    }
}

// Make it available globally for the content script
window.OpenFoodFactsBrowser = OpenFoodFactsBrowser;