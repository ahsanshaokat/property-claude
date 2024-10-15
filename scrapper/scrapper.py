import requests
from bs4 import BeautifulSoup
import psycopg2
import logging
import random
import string

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Database connection setup (replace with your database details)
conn = psycopg2.connect(
    host="ec2-3-111-69-192.ap-south-1.compute.amazonaws.com",
    database="property_me",
    user="postgres",
    password="weet0383"
)
cursor = conn.cursor()
logging.info('Database connection established.')

# Base URL to start scraping from
BASE_URL = 'https://www.olx.com.pk/property-for-sale_c2'

# Function to extract text safely
def safe_extract(element):
    """Extracts and returns text if the element exists, otherwise returns None."""
    return element.text.strip() if element else None

# Generate a random slug for the property
def generate_slug(name):
    """Generates a slug for the property name."""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))

# Generic function to find the "Load more" link
def find_load_more_link(soup):
    """Attempt to find a 'Load more' link using button elements."""
    load_more_button = soup.find('a', href=True, string=lambda x: 'Load more' in x if x else False)
    return load_more_button['href'] if load_more_button else None

# Function to insert data into the database
def insert_property_into_db(data):
    """Insert a property record into the database."""
    if not data['name'] or not data['price'] or not data['location']:
        logging.warning(f"Skipping property with missing data: {data}")
        return  # Skip records with missing data

    # Generate slug from name or create a default one
    slug = generate_slug(data['name']) if data['name'] else generate_slug('property')
    
    # Example of assigning a property type (this may need to be refined based on actual logic)
    property_type_id = 29  # For example, 'Houses' has id 29, replace with appropriate logic

    # Default data for now
    purpose = 'For Sale'
    description = data.get('name', 'No description available')  # Use name as description if not available
    no_of_bed_room = 3  # Set default or map based on scraping
    no_of_bath_room = 2  # Set default or map based on scraping
    property_size = 1000  # Set default or map based on scraping
    year_build = 2020  # Set default or map based on scraping
    total_floors = 1  # Set default or map based on scraping
    accommodations = 'N/A'
    ceiling_height = 10.0  # Set default or map based on scraping
    distance_from_center = 5.0  # Set default or map based on scraping
    parking = 'Available'
    heating = 'None'
    area_size = 1200.0  # Set default or map based on scraping
    garage = False
    utility_cost = 100  # Default value
    cable_tv_cost = 50  # Default value
    electricity_cost = 'Rs 1000'  # Default value
    deposit = 10000.0  # Default value
    pet_allowed = False
    payment_period = 'Monthly'
    habitable = 'Yes'
    minimum_stay_duration = 12

    insert_query = """
    INSERT INTO properties (
        name, slug, purpose, descriptions, address, price, no_of_bed_room, no_of_bath_room, 
        property_size, year_build, total_floors, accommodations, ceiling_height, 
        distance_from_center, parking, heating, area_size, garage, utility_cost, 
        cable_tv_cost, electricity_cost, deposit, pet_allowed, payment_period, 
        habitable, minimum_stay_duration, property_type_id, agent_id, city_id
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    try:
        cursor.execute(insert_query, (
            data['name'], slug, purpose, description, data['location'], data['price'], 
            no_of_bed_room, no_of_bath_room, property_size, year_build, total_floors, 
            accommodations, ceiling_height, distance_from_center, parking, heating, 
            area_size, garage, utility_cost, cable_tv_cost, electricity_cost, 
            deposit, pet_allowed, payment_period, habitable, minimum_stay_duration, 
            property_type_id, 1, 1  # agent_id and city_id fixed as per your request
        ))
        conn.commit()
        logging.info(f"Inserted property '{data['name']}' into the database.")
    except Exception as e:
        logging.error(f"Error inserting data into DB: {e}")
        conn.rollback()  # Rollback the transaction on error

# Function to scrape a single page
def scrape_page(url):
    logging.info(f'Starting to scrape data from: {url}')
    try:
        # Fetch the page content
        response = requests.get(url)
        if response.status_code != 200:
            logging.error(f'Failed to fetch the page. Status code: {response.status_code}')
            return []
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find property listings (Update this section to target actual property listings)
        listings = soup.find_all('div', class_='_3VfJj2')
        if not listings:
            logging.info(f'No property listings found on {url}')
            return []
        
        scraped_data = []
        
        for idx, listing in enumerate(listings):
            try:
                # Extracting attributes like name, price, and location based on correct structure
                name = safe_extract(listing.find('h2', class_='_89yzn1'))
                price = safe_extract(listing.find('span', class_='_2vNptt'))
                location = safe_extract(listing.find('span', class_='_2BmUPh'))
                
                if not name or not price or not location:
                    logging.warning(f"Skipping property with missing data: Name={name}, Price={price}, Location={location}")
                    continue

                # Collect data
                property_data = {
                    'name': name,
                    'price': price,
                    'location': location
                }
                scraped_data.append(property_data)

                # Insert into the database
                insert_property_into_db(property_data)

                logging.info(f"Property {idx + 1}: Name: {name}, Price: {price}, Location: {location}")
            except Exception as e:
                logging.error(f'Error extracting property data: {e}')
        
        return scraped_data
    except Exception as e:
        logging.error(f'Error fetching page {url}: {e}')
        return []

# Recursive function to handle pagination with 'Load More' button and page limit
def scrape_recursive(url, page_limit=5):
    current_page = 1
    scraped_data = []

    while current_page <= page_limit:
        logging.info(f'Scraping page {current_page}...')
        page_data = scrape_page(url)
        if not page_data:
            break  # If no data is found, stop the loop

        scraped_data += page_data
        
        # Find the "Load more" or pagination link for the next page
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        next_page_url = find_load_more_link(soup)
        
        if next_page_url:
            next_page_url = requests.compat.urljoin(BASE_URL, next_page_url)
            logging.info(f'Next page found: {next_page_url}')
            url = next_page_url  # Move to the next page
            current_page += 1
        else:
            logging.info(f'No more pages found after page {current_page}.')
            break
    
    return scraped_data

# Main function to scrape and insert results into the database
def main(page_limit=5):
    logging.info('Scraping process started.')
    scraped_data = scrape_recursive(BASE_URL, page_limit)
    
    logging.info(f'Total properties scraped: {len(scraped_data)}')
    logging.info('Scraping process completed.')

if __name__ == "__main__":
    main(page_limit=1)

# Close the database connection when done
cursor.close()
conn.close()
logging.info('Database connection closed.')
