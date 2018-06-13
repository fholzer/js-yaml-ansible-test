'use strict';

/*eslint-disable no-console*/

var fs   = require('fs');
var path = require('path');
var util = require('util');
var yaml = require('js-yaml');


// Let's define a couple of classes.

function Vault(data) {
  this.klass = 'Vault';
  this.data  = data;
}

// Then define YAML types to load and dump our Point/Space objects.

var VaultYamlType = new yaml.Type('!vault', {
  // Loader must parse sequence nodes only for this type (i.e. arrays in JS terminology).
  // Other available kinds are 'scalar' (string) and 'mapping' (object).
  // http://www.yaml.org/spec/1.2/spec.html#kind//
  kind: 'scalar',

  // Loader must check if the input object is suitable for this type.
  resolve: function (data) {
    // `data` may be either:
    // - Null in case of an "empty node" (http://www.yaml.org/spec/1.2/spec.html#id2786563)
    // - Array since we specified `kind` to 'sequence'
    return data.startsWith("$ANSIBLE_VAULT;");
  },

  // If a node is resolved, use it to create a Point instance.
  construct: function(data) {
    return new Vault(data);
  },

  // Dumper must process instances of Point by rules of this YAML type.
  instanceOf: Vault,

  // Dumper must represent Point objects as three-element sequence in YAML.
  represent: function(vault) {
    return vault.data;
  }
});

var ANSIBLE_SCHEMA = yaml.Schema.create(yaml.SAFE_SCHEMA, [ VaultYamlType ]);

// do not execute the following if file is required (http://stackoverflow.com/a/6398335)
if (require.main === module) {

  // And read a document using that schema.
  fs.readFile(path.join(__dirname, 'custom_types.yml'), 'utf8', function (error, data) {
    var loaded;

    if (!error) {
      loaded = yaml.load(data, { schema: ANSIBLE_SCHEMA });
      console.log(util.inspect(loaded, false, 20, true));
    } else {
      console.error(error.stack || error.message || String(error));
    }
  });
}

// There are some exports to play with this example interactively.
module.exports.Vault         = Vault;
module.exports.VaultYamlType = VaultYamlType;
module.exports.ANSIBLE_SCHEMA  = ANSIBLE_SCHEMA;
