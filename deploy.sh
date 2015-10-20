#!/bin/bash
# Deploying into Google App Engine
APP=phoxy-bootstrap
~/google-cloud-sdk/google_appengine/appcfg.py -A $APP update app.yaml