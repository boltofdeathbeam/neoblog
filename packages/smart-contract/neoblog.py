from boa.blockchain.vm.Neo.Runtime import CheckWitness, Notify
from boa.blockchain.vm.Neo.Storage import Get, GetContext, Put
from boa.code.builtins import concat, hash160

from neoblog.submitPost import submitPost
from neoblog.manageUser import manageUser
# from neoblog.addToCategory import addPostToCategory


"""
==========================
========== MAIN ==========
==========================
"""
def Main(operation, args):

  """
  Main for SC

    :param operation: The function performed
    :type operation: str

    :param args: list of arguments
      args[0] always sender hash
    :param type: str

  """

  user = args[0]
  authorized = CheckWitness(user)

  if not authorized:
    Notify("Not authorized")
    return False

  if operation != None:
    # Requires: user, postHash, category
    if operation == 'submitPost' and len(args) == 3:
      submitPost(args)

    # Requires: user, postHash, category - optionally more categories
    # if operation == 'addPostToCategory' and len(args) >= 3:
      # addPostToCategory(args)
    
    # Requires: user, userName
    if operation == 'manageUser' and len(args) == 3:
      manageUser(args)

  return False
  # Signals a bad request has been made without a known or even any operation
