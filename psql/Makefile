db.build: 
		docker build -t iseagrass/database .

db.run:
		docker run -e POSTGRES_DB=iseagrass -e POSTGRES_PASSWORD=password -p '5432:5432' iseagrass/database
