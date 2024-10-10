import requests
from bs4 import BeautifulSoup
import psycopg2
import logging
import time
from urllib.parse import urljoin

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Database connection setup (PostgreSQL example with your details)
conn = psycopg2.connect(
    host="localhost",
    database="property_me",
    user="postgres",
    password=""  # Empty password
)
cursor = conn.cursor()
logging.info('Database connection established.')

# Define base Zameen URL
BASE_URL = 'https://www.zameen.com'

# Maintain a set of visited URLs to avoid redundancy
visited_urls = set()

# Extract attribute value by label (helper function)
def extract_attribute(property_card, class_name):
    """Helper function to extract the attribute value using the class name."""
    try:
        element = property_card.find('span', class_=class_name)
        if element:
            return element.text.strip()
    except Exception as e:
        logging.error(f'Error extracting {class_name}: {e}')
    return None

# Recursive scraper function
def scrape_recursive(url, depth=0, max_depth=3):
    if url in visited_urls:
        logging.info(f'Skipping already visited URL: {url}')
        return
    if depth > max_depth:
        logging.info(f'Reached max depth of recursion for URL: {url}')
        return

    logging.info(f'Starting to scrape data from: {url} (Depth: {depth})')

    # Add the URL to the visited set
    visited_urls.add(url)

    # Fetch the page content
    response = requests.get(url)
    if response.status_code != 200:
        logging.error(f'Failed to fetch the page. Status code: {response.status_code}')
        return

    soup = BeautifulSoup(response.text, 'html.parser')

    # Identify property listings
    properties = soup.find_all('div', class_='ef447dde')  # Update class based on actual page structure
    if properties:
        logging.info(f'Found {len(properties)} properties on the page.')
        for idx, property in enumerate(properties, start=1):
            try:
                logging.info(f'Processing property {idx}')
                # Extract dynamic data fields from HTML structure
                name = property.find('span', class_='e19f350d').text.strip()  # Property title
                price = property.find('span', class_='f343d9ce').text.strip()  # Price
                address = property.find('span', class_='e9f1cc16').text.strip()  # Address
                
                # Extract additional data such as bedrooms, bathrooms, etc.
                no_of_bedroom = extract_attribute(property, 'f9a5d961')  # Bedrooms
                no_of_bathroom = extract_attribute(property, 'd2fe3778')  # Bathrooms
                property_size = extract_attribute(property, 'ef219b82')  # Property size
                year_built = extract_attribute(property, 'year-built-class')  # Replace with actual class if available
                total_floors = extract_attribute(property, 'total-floors-class')  # Replace with actual class if available
                property_type = extract_attribute(property, 'type-class')  # Replace with actual class if available

                # Log each property data
                logging.info(f'Property: {name}, Price: {price}, Address: {address}')

                # Insert data into the database (simplified for example purposes)
                insert_property_into_db(
                    name=name,
                    purpose='Sale',  # Example
                    descriptions='Property description from Zameen',
                    address=address,
                    price=price.replace('PKR ', '').replace(',', ''),  # Clean the price
                    no_of_bedroom=no_of_bedroom,
                    no_of_bathroom=no_of_bathroom,
                    property_size=property_size,
                    year_built=year_built,
                    total_floors=total_floors,
                    accommodations=f'{no_of_bedroom} beds, {no_of_bathroom} baths',  # Dynamic value
                    ceiling_height=None,  # Could add if available
                    distance_from_center=None,  # Could add if available
                    parking='Available',  # Example
                    area_size=property_size,
                    garage=True,  # Example
                    garage_size=1,  # Example
                    additional_spec='Additional Specifications',
                    utility_cost=100,
                    cable_tv_cost=50,
                    electricity_cost='Standard',
                    lat=33.6844,
                    long=73.0479,
                    video_tour_link='http://example.com',
                    property_type=property_type,  # Dynamically extracted
                    agent=1,  # Example
                    city=1,  # Example
                    features=[1, 2, 3],  # Example
                    floor_plans=[],
                    property_images=[1, 2, 3],
                    rent_criteria=None
                )
                logging.info(f'Property {name} inserted into the database successfully.')
            except Exception as e:
                logging.error(f"Error extracting property data for property {idx}: {e}")
    else:
        logging.info(f'No property listings found on {url}')

    # Extract and follow links to other pages, ignoring /blog URLs
    links = soup.find_all('a', href=True)
    for link in links:
        href = link['href']
        full_url = urljoin(BASE_URL, href)

        # Filter URLs: ignore /blog pages and non-relevant URLs
        if '/blog' in full_url:
            logging.info(f'Skipping /blog URL: {full_url}')
            continue  # Skip /blog URLs

        # Ensure the URL is part of the Zameen domain and hasn't been visited yet
        if BASE_URL in full_url and full_url not in visited_urls:
            logging.info(f'Found new URL to follow: {full_url}')
            time.sleep(1)  # Delay to avoid overwhelming the server
            scrape_recursive(full_url, depth=depth + 1, max_depth=max_depth)

# Function to insert scraped data into the database
def insert_property_into_db(
    name, purpose, descriptions, address, price, no_of_bedroom, no_of_bathroom,
    property_size, year_built, total_floors, accommodations, ceiling_height, distance_from_center,
    parking, area_size, garage, garage_size, additional_spec, utility_cost,
    cable_tv_cost, electricity_cost, lat, long, video_tour_link, property_type, agent,
    city, features, floor_plans, property_images, rent_criteria):
    
    # Insert SQL query (assuming a table 'property' with appropriate columns exists)
    insert_query = """
    INSERT INTO property (
        name, purpose, descriptions, address, price, no_of_bedroom, no_of_bathroom,
        property_size, year_built, total_floors, accommodations, ceiling_height,
        distance_from_center, parking, area_size, garage, garage_size, additional_spec,
        utility_cost, cable_tv_cost, electricity_cost, lat, long, video_tour_link,
        property_type, agent, city, features, floor_plans, property_images, rent_criteria
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    # Execute the query
    cursor.execute(insert_query, (
        name, purpose, descriptions, address, price, no_of_bedroom, no_of_bathroom,
        property_size, year_built, total_floors, accommodations, ceiling_height,
        distance_from_center, parking, area_size, garage, garage_size, additional_spec,
        utility_cost, cable_tv_cost, electricity_cost, lat, long, video_tour_link,
        property_type, agent, city, features, floor_plans, property_images, rent_criteria
    ))
    conn.commit()
    logging.info(f'Inserted property "{name}" into the database.')

# Main function to scrape and insert
def main():
    logging.info('Scraping process started.')
    scrape_recursive(BASE_URL)
    logging.info('Scraping process completed.')

if __name__ == "__main__":
    main()

# Close the database connection when done
cursor.close()
conn.close()
logging.info('Database connection closed.')
