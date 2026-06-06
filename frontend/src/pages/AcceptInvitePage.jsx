import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, Mail, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function AcceptInvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState(null);
  const [accepting, setAccepting] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/scheduling/accept-invite/${token}/details`);
        if (res.data.success) {
          setInvitation(res.data.invitation);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load invitation.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [token, BACKEND_URL]);

  const handleAccept = async () => {
    if (!user) {
      // Store intended destination and redirect to login
      navigate(`/login?returnUrl=/accept-invite/${token}`);
      return;
    }

    setAccepting(true);
    try {
      const tokenString = localStorage.getItem('token');
      const res = await axios.post(
        `${BACKEND_URL}/api/scheduling/accept-invite/${token}`,
        {},
        { headers: { Authorization: `Bearer ${tokenString}` } }
      );
      if (res.data.success) {
        toast({ title: 'Success', description: 'You have successfully joined the organization.' });
        navigate('/dashboard'); // or wherever they should go
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to accept invitation.',
        variant: 'destructive',
      });
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-10 h-10 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 max-w-md w-full shadow-2xl text-center border border-red-100 dark:border-red-900/30">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Invalid Invitation</h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold transition-transform hover:scale-[1.02]"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 md:p-12 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800 text-center">
        <div className="w-20 h-20 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10 text-brand-blue" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">You've been invited!</h1>
        
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          You have been invited to join <strong className="text-gray-900 dark:text-white">{invitation?.organizationName}</strong> as a {invitation?.role.toLowerCase()}.
        </p>

        {!user && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-2xl mb-8 text-sm text-yellow-800 dark:text-yellow-200">
            You will be asked to log in or create an account to accept this invitation.
          </div>
        )}

        <button
          onClick={handleAccept}
          disabled={accepting}
          className="w-full py-4 bg-brand-gradient text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-blue/20"
        >
          {accepting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
            <>
              Accept Invitation
              <CheckCircle className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
