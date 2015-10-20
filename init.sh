#!/bin/bash
# Initialise repository for development or deploy on vps
composer update
ln -s vendor/phoxy/phoxy/ phoxy
