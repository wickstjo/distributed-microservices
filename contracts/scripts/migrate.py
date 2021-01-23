#!/usr/bin/env python
# coding: utf-8

# In[24]:


import os
import json


# ### PATHS

# In[43]:


root = '/home/wickstjo/coding/work'


# In[44]:


middleware = root + '/middleware/resources/'


# In[45]:


frontend = root + '/app/src/resources/'


# In[53]:


interfaces = root + '/contracts/build/contracts/'


# ### LIST OF ABI REFERENCES -- REMOVE MIGRATIONS

# In[ ]:


files = os.listdir(interfaces)


# In[ ]:


files.remove('Migrations.json')


# ### CREATE UNITED ABI FILE

# In[53]:


latest = {}


# In[54]:


def load_json(path):
    with open(path) as json_file:
        return json.load(json_file)


# In[55]:


for file in files:
    
    # CREATE NEW HEADER & EXTRACT JSON CONTENT
    header = file[0:-5].lower()
    content = load_json(path + file)
    
    # NETWORK LIST
    network_list = list(content['networks'].keys())
    
    # IF THE CONTRACT DOES NOT HAVE AN ADDRESS
    if len(network_list) == 0:
        address = 'undefined'
    
    # IF IT DOES, EXTRACT IT
    else:
        address = content['networks'][network_list[0]]['address']
    
    # PUSH TO CONTAINER
    latest[header] = {
        'address': address,
        'abi': content['abi'] 
    }


# ### DISTRIBUTE THE FILE TO OTHER REPOS

# In[56]:


def save_json(data, path):
    with open(path, 'w') as outfile:
        json.dump(data, outfile)


# In[35]:


repos = [middleware, frontend]


# In[58]:


for repo in repos:
    save_json(latest, repo + 'latest.json')


# In[ ]:




